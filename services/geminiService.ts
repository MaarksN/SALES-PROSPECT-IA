
import { Type, GenerateContentResponse, Schema } from "@google/genai";
import { Lead, SalesKit, Competitor, DecisionMaker, AIToolConfig, UserContext, BirthubDossier, BirthubAnalysisResult, GroundingSource } from '../types';
import { supabase } from '../lib/supabase';

/**
 * SECURITY UPDATE:
 * BFF (Backend-for-Frontend) Pattern Implemented.
 * API Key is now secure on the server.
 * Frontend calls /api/generate which proxies to Google GenAI.
 */

// Using stable model version
const modelName = 'gemini-1.5-flash';

// Simple LRU Cache implementation
class SimpleLRUCache<K, V> {
  private map: Map<K, V>;
  private max: number;

  constructor(max: number = 50) {
    this.map = new Map<K, V>();
    this.max = max;
  }

  get(key: K): V | undefined {
    const item = this.map.get(key);
    if (item) {
      // refresh key
      this.map.delete(key);
      this.map.set(key, item);
    }
    return item;
  }

  set(key: K, value: V): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.max) {
      const firstKey = this.map.keys().next().value;
      if (firstKey !== undefined) {
        this.map.delete(firstKey);
      }
    }
    this.map.set(key, value);
  }

  has(key: K): boolean {
    return this.map.has(key);
  }
}

const memoryCache = new SimpleLRUCache<string, any>(50);

const generateCacheKey = (...args: any[]): string => {
  return args.map(arg => JSON.stringify(arg)).join('|');
};

// Interface to replace 'any' for config
interface GenerateConfig {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
    stopSequences?: string[];
    responseMimeType?: string;
    responseSchema?: Schema;
    tools?: any[];
    systemInstruction?: string;
    [key: string]: any;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function fetchWithBackoff(fn: () => Promise<any>, retries = 3, wait = 1000): Promise<any> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error.status === 429 || error.message?.includes('429'))) {
      console.warn(`Rate limited. Retrying in ${wait}ms...`);
      await delay(wait);
      return fetchWithBackoff(fn, retries - 1, wait * 2);
    }
    throw error;
  }
}

/**
 * Helper to call the BFF endpoint.
 * Replaces direct GoogleGenAI SDK usage on the client.
 */
const callGeminiAPI = async (model: string, contents: any, config?: GenerateConfig): Promise<any> => {
    return fetchWithBackoff(async () => {
        try {
            // 1. Get Session Token for Security
            const { data: { session } } = await supabase.auth.getSession();

            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    model,
                    contents,
                    config
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                // Pass status code in error message for backoff detection
                throw new Error(`API Error (${response.status}): ${errorText}`);
            }

            const data = await response.json();

            // Compatibility shim: Add .text property if missing, extracting from candidates
            if (data && !('text' in data)) {
                let textVal = null;
                if (data.candidates && data.candidates.length > 0) {
                    const candidate = data.candidates[0];
                    if (candidate.content && candidate.content.parts) {
                        textVal = candidate.content.parts.map((p: any) => p.text || '').join('');
                    }
                }
                // Return a new object with the text property
                return { ...data, text: textVal };
            }

            return data;
        } catch (error) {
            console.error("BFF Call Failed:", error);
            throw error;
        }
    });
};


/**
 * Helper to convert simplified schema to Gemini API Schema
 */
export const convertToGeminiSchema = (simpleSchema: Record<string, string>): Schema => {
  const properties: Record<string, Schema> = {};
  
  Object.entries(simpleSchema).forEach(([key, value]) => {
    if (value === 'array') {
      properties[key] = {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      };
    } else if (value === 'number') {
      properties[key] = { type: Type.NUMBER };
    } else if (value === 'boolean') {
      properties[key] = { type: Type.BOOLEAN };
    } else if (value === 'object') {
       properties[key] = { type: Type.OBJECT, properties: { data: { type: Type.STRING } } };
    } else {
      properties[key] = { type: Type.STRING };
    }
  });

  return {
    type: Type.OBJECT,
    properties: properties,
    required: Object.keys(properties)
  };
};

/**
 * GENERIC AI TOOL EXECUTOR
 */
export const executeSalesTool = async (
  tool: AIToolConfig, 
  inputs: Record<string, string>,
  userContext?: UserContext,
  onChunk?: (text: string) => void
): Promise<string> => {
  return executeAITool(
    tool.promptTemplate, 
    inputs, 
    tool.systemRole || 'Sales Assistant', 
    userContext,
    tool.outputSchema,
    onChunk
  );
};

export const executeAITool = async (
  promptTemplate: string, 
  inputs: Record<string, string>, 
  systemRole: string = 'Assistente de Vendas de Alta Performance',
  userContext?: UserContext,
  simpleSchema?: Record<string, string>,
  onChunk?: (text: string) => void
): Promise<string> => {
  const cacheKey = generateCacheKey('executeAITool', promptTemplate, inputs, systemRole, userContext, simpleSchema);
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  try {
    let finalPrompt = promptTemplate;
    Object.keys(inputs).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      finalPrompt = finalPrompt.replace(regex, inputs[key] || '');
    });

    let enrichedSystemRole = systemRole;
    if (userContext) {
      enrichedSystemRole += `\n\nCONTEXTO DO USUÁRIO (Obrigatório seguir):
      - Minha Empresa: ${userContext.myCompany}
      - Meu Cargo: ${userContext.myRole}
      - O que eu vendo: ${userContext.myProduct}
      - Meu Tom de Voz Preferido: ${userContext.toneOfVoice}
      - Público Alvo: ${userContext.targetAudience}
      
      IMPORTANTE: Adapte a resposta para refletir este contexto e tom de voz.`;
    }

    // 3. Configuração da Chamada
    const generateConfig: GenerateConfig = {
      temperature: 0.7,
    };

    if (simpleSchema) {
      generateConfig.responseMimeType = "application/json";
      generateConfig.responseSchema = convertToGeminiSchema(simpleSchema);
    }

    // 4. Chamada à API via BFF
    const contents = [
        { 
            role: 'user', 
            parts: [{ text: `SYSTEM ROLE: ${enrichedSystemRole}\n\n--- TAREFA ---\n${finalPrompt}` }] 
        }
    ];

    const response = await callGeminiAPI(modelName, contents, generateConfig);

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    let textResponse = "Sem resposta gerada.";

    if (onChunk && !simpleSchema && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        textResponse = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const dataStr = line.replace('data: ', '');
                    if (dataStr === '[DONE]') break;
                    try {
                        const data = JSON.parse(dataStr);
                        if (data.text) {
                            textResponse += data.text;
                            onChunk(textResponse);
                        }
                    } catch (e) {}
                }
            }
        }
    } else {
        const jsonResponse = await response.json();
        textResponse = jsonResponse.text || jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta gerada.";
    }

    if (simpleSchema && textResponse) {
       try {
         const json = JSON.parse(textResponse);
         const result = JSON.stringify(json, null, 2);
         memoryCache.set(cacheKey, result);
         return result;
       } catch (e) {
         memoryCache.set(cacheKey, textResponse);
         return textResponse;
       }
    }

    memoryCache.set(cacheKey, textResponse);
    return textResponse;

  } catch (error: any) {
    console.error("Tool Execution Error:", error);
    throw new Error(error.message || "Falha ao executar a ferramenta de IA.");
  }
};

/**
 * 🕵️‍♂️ BIRTHUB AI v2.1 ENGINE
 */
export const executeBirthubEngine = async (target: string): Promise<BirthubAnalysisResult | null> => {
  const cacheKey = generateCacheKey('executeBirthubEngine', target);
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  try {
    const systemPrompt = `Você é o Birthub AI v2.1, o Agente de Prospecção Comercial B2B autônomo.

    MISSÃO:
    Identificar, analisar, priorizar e ativar potenciais leads de forma automática, utilizando inteligência artificial, dados públicos e sinais de intenção de compra.

    IDENTIDADE FUNCIONAL:
    Você opera como um time completo composto por:
    1. Investigador corporativo (Coleta de dados públicos)
    2. Especialista em Enrichment (Validação de e-mails, cargos e stack)
    3. Analista de RevOps (Scoring preditivo e qualificação)
    4. Copywriter Enterprise (Criação de abordagem personalizada)

    DIRETRIZES DE "ZERO ALUCINAÇÃO":
    - Todo dado só pode existir se houver evidência pública verificável (Use a Google Search Tool).
    - Se a informação (ex: telefone, email exato) não estiver disponível publicamente, retorne NULL.
    - Nunca invente cargos ou nomes.
    - Priorize qualidade sobre quantidade.

    CRITÉRIOS DE SCORING (0-100):
    - < 75 (REJECTED): Lead frio, sem fit ou sem dados suficientes.
    - 75-84 (REVIEW_NEEDED): Lead morno, fit parcial ou dados incertos.
    - > 85 (APPROVED): ICP Ideal, sinais de compra claros (vagas, notícias, tecnologia compatível).

    SAÍDA:
    Gere um dossiê JSON estritamente tipado contendo análise profunda, score detalhado e estratégia de ativação.`;

    const contents = `TARGET PARA ANÁLISE PROFUNDA: ${target}`; // Can be string or object, callGeminiAPI handles basic contents
    // Ideally convert to object for consistency
    const contentsObj = { role: 'user', parts: [{ text: contents }] };

    const config: GenerateConfig = {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            company: {
              type: Type.OBJECT,
              properties: {
                legal_name: { type: Type.STRING, nullable: true },
                trade_name: { type: Type.STRING, nullable: true },
                cnpj: { type: Type.STRING, nullable: true },
                industry: { type: Type.STRING, nullable: true },
                business_model: { type: Type.STRING, enum: ['B2B', 'B2C', 'Marketplace'], nullable: true },
                maturity_level: { type: Type.STRING, enum: ['Early', 'Growth', 'Enterprise'], nullable: true },
                employee_range: { type: Type.STRING, nullable: true },
                website: { type: Type.STRING, nullable: true },
                linkedin_company: { type: Type.STRING, nullable: true },
                phone: { type: Type.STRING, nullable: true },
                email: { type: Type.STRING, nullable: true },
                address: { type: Type.STRING, nullable: true },
              }
            },
            digital_presence: {
              type: Type.OBJECT,
              properties: {
                website_active: { type: Type.BOOLEAN },
                linkedin_active: { type: Type.BOOLEAN },
                other_channels: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            decision_maker: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, nullable: true },
                role: { type: Type.STRING, nullable: true },
                linkedin_profile: { type: Type.STRING, nullable: true },
                email: { type: Type.STRING, nullable: true },
                phone: { type: Type.STRING, nullable: true },
                whatsapp: { type: Type.STRING, nullable: true }
              }
            },
            technology: {
              type: Type.OBJECT,
              properties: {
                detected_stack: { type: Type.ARRAY, items: { type: Type.STRING } },
                crm: { type: Type.STRING, nullable: true },
                marketing_tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                sales_tools: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            signals: {
              type: Type.OBJECT,
              properties: {
                hiring_sales: { type: Type.BOOLEAN },
                hiring_marketing: { type: Type.BOOLEAN },
                recent_funding: { type: Type.BOOLEAN },
                expansion_signals: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            scoring: {
              type: Type.OBJECT,
              properties: {
                company: {
                  type: Type.OBJECT,
                  properties: {
                    legal_name: { type: Type.STRING, nullable: true },
                    trade_name: { type: Type.STRING, nullable: true },
                    cnpj: { type: Type.STRING, nullable: true },
                    industry: { type: Type.STRING, nullable: true },
                    business_model: { type: Type.STRING, enum: ['B2B', 'B2C', 'Marketplace'], nullable: true },
                    maturity_level: { type: Type.STRING, enum: ['Early', 'Growth', 'Enterprise'], nullable: true },
                    employee_range: { type: Type.STRING, nullable: true },
                    website: { type: Type.STRING, nullable: true },
                    linkedin_company: { type: Type.STRING, nullable: true },
                    phone: { type: Type.STRING, nullable: true },
                    email: { type: Type.STRING, nullable: true },
                    address: { type: Type.STRING, nullable: true },
                  }
                },
                digital_presence: {
                  type: Type.OBJECT,
                  properties: {
                    website_active: { type: Type.BOOLEAN },
                    linkedin_active: { type: Type.BOOLEAN },
                    other_channels: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                },
                decision_maker: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, nullable: true },
                    role: { type: Type.STRING, nullable: true },
                    linkedin_profile: { type: Type.STRING, nullable: true },
                    email: { type: Type.STRING, nullable: true },
                    phone: { type: Type.STRING, nullable: true },
                    whatsapp: { type: Type.STRING, nullable: true }
                  }
                },
                technology: {
                  type: Type.OBJECT,
                  properties: {
                    detected_stack: { type: Type.ARRAY, items: { type: Type.STRING } },
                    crm: { type: Type.STRING, nullable: true },
                    marketing_tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                    sales_tools: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                },
                signals: {
                  type: Type.OBJECT,
                  properties: {
                    hiring_sales: { type: Type.BOOLEAN },
                    hiring_marketing: { type: Type.BOOLEAN },
                    recent_funding: { type: Type.BOOLEAN },
                    expansion_signals: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                },
                scoring: {
                  type: Type.OBJECT,
                  properties: {
                    total_score: { type: Type.NUMBER },
                    breakdown: {
                      type: Type.OBJECT,
                      properties: {
                        tech_fit: { type: Type.NUMBER },
                        market_timing: { type: Type.NUMBER },
                        budget_potential: { type: Type.NUMBER },
                        data_confidence: { type: Type.NUMBER }
                      }
                    },
                    reasoning: { type: Type.STRING }
                  }
                },
                decision: {
                  type: Type.OBJECT,
                  properties: {
                    status: { type: Type.STRING, enum: ['APPROVED', 'REJECTED', 'REVIEW_NEEDED'] },
                    confidence_level: { type: Type.STRING, enum: ['LOW', 'MEDIUM', 'HIGH'] }
                  }
                },
                outreach: {
                  type: Type.OBJECT,
                  properties: {
                    recommended_channel: { type: Type.STRING, enum: ['EMAIL', 'WHATSAPP', 'LINKEDIN', 'NONE'] },
                    subject: { type: Type.STRING, nullable: true },
                    message: { type: Type.STRING, nullable: true }
                  }
                }
              }
            }
          }
        }
    };

    const response = await callGeminiAPI(modelName, [contentsObj], config);

    const jsonResponse = await response.json();
    const text = jsonResponse.text || jsonResponse.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      const dossier = JSON.parse(text) as BirthubDossier;
      
      const sources: GroundingSource[] = [];
      if (jsonResponse.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        jsonResponse.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
          if (chunk.web?.uri) {
            sources.push({ title: chunk.web.title, uri: chunk.web.uri });
          }
        });
      }

      const result = { dossier, sources };
      memoryCache.set(cacheKey, result);
      return result;
    }
    return null;

  } catch (error) {
    console.error("Birthub AI Engine Failed:", error);
    throw error;
  }
};

/**
 * CHATBOT SERVICE
 */
export const sendChatMessage = async (
  history: { role: 'user' | 'model', text: string }[], 
  newMessage: string,
  userContext?: UserContext
) => {
  try {
    let systemInstruction = "Você é um assistente de vendas de elite. Ajude o usuário a vender mais, superar objeções e criar estratégias.";
    if (userContext) {
      systemInstruction += `\n\nContexto: Você trabalha para a empresa ${userContext.myCompany}, vendendo ${userContext.myProduct}. Use um tom ${userContext.toneOfVoice}.`;
    }

    // Construct full history for stateless call
    const contents = history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
    }));
    // Add new message
    contents.push({ role: 'user', parts: [{ text: newMessage }] });

    const response = await callGeminiAPI(modelName, contents, { systemInstruction });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

/**
 * FEATURE 11 & 21: AI Deep Lead Search & Scoring
 */
export const searchNewLeads = async (
  sector: string, 
  location: string, 
  keywords: string,
  size: string,
  quantity: number
): Promise<Partial<Lead>[]> => {
  // Stub or implement if needed. Keeping it short for now as the logic is similar.
  // The user didn't ask to fix this specifically but "Improvements".
  // I will just implement the generic tool execution which covers most cases.
  // But this specific function is likely used by LeadList or AILab.
  // I should implement it via /api/generate as well.

  const cacheKey = generateCacheKey('searchNewLeads', sector, location, keywords, size, quantity);
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  try {
    const prompt = `Atue como um especialista de elite em inteligência de vendas B2B.
    Encontre EXATAMENTE ${quantity} empresas reais e ativas no setor de "${sector}" localizadas em "${location}".
    Filtro de precisão: Tamanho "${size}", Foco estratégico em "${keywords}".
    
    Para cada empresa, você DEVE fornecer um motivo estratégico (matchReason) de "Por que este lead é uma oportunidade de ouro?".
    
    Retorne um JSON com:
    1. Nome real (companyName).
    2. Localização e Telefone.
    3. Website (se houver).
    4. Score de Lead (0-100) - Seja rigoroso.
    5. Tech Stack (tecnologias prováveis).
    6. Tags (ex: "Alta Crescimento", "Decisor Oculto").
    7. matchReason: Uma frase curta e impactante explicando por que essa empresa é perfeita para prospectar agora.
    
    Use a ferramenta de busca para garantir dados reais.`;

    const contents = [{ role: 'user', parts: [{ text: prompt }] }];

    const response = await callGeminiAPI(modelName, contents, {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              companyName: { type: Type.STRING },
              location: { type: Type.STRING },
              sector: { type: Type.STRING },
              website: { type: Type.STRING },
              phone: { type: Type.STRING },
              score: { type: Type.NUMBER },
              techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              revenueEstimate: { type: Type.STRING },
              matchReason: { type: Type.STRING, description: "Motivo estratégico da escolha" }
            },
            required: ["companyName", "location", "score", "matchReason"]
          }
        }
    });

    const json = await response.json();
    const text = json.text || json.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      const result = JSON.parse(text);
      memoryCache.set(cacheKey, result);
      return result;
    }
    return [];
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return [];
  }
};

// ... Rest of the functions (enrichDecisionMakers, generateSalesKit, etc.) follow the same pattern.
// I will implement them all to be safe.

export const enrichDecisionMakers = async (companyName: string): Promise<DecisionMaker[]> => {
  try {
    const prompt = `Identifique cargos prováveis de tomadores de decisão na empresa ${companyName}. 
    Foque em Diretores, Gerentes e C-Level. Retorne 3 personas.`;

    const contents = [{ role: 'user', parts: [{ text: prompt }] }];

    const response = await callGeminiAPI(modelName, contents, {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              role: { type: Type.STRING },
              linkedin: { type: Type.STRING }
            }
          }
        }
    });
    const json = await response.json();
    const text = json.text || json.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ? JSON.parse(text) : [];
  } catch (error) {
    console.error("Decision Makers Error:", error);
    return [];
  }
};

export const generateSalesKit = async (companyName: string, sector: string): Promise<SalesKit | null> => {
  const cacheKey = generateCacheKey('generateSalesKit', companyName, sector);
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  try {
    const prompt = `Crie um Kit de Vendas B2B completo para prospectar a empresa ${companyName} (${sector}).
    Língua: Português (Brasil). Tom: Consultivo e Profissional.
    
    O kit deve conter:
    1. Proposta de Valor (1 frase de impacto).
    2. Assunto de Email Frio (Catchy).
    3. Corpo do Email Frio (Personalizado, curto).
    4. Script de Ligação (Telefone) estruturado (Abertura, Gancho, Pergunta, Fechamento).
    5. Cadência de Prospecção de 3 passos (Dia 1, Dia 3, Dia 7) misturando canais.
    6. Duas objeções comuns e como contornar.`;

    const contents = [{ role: 'user', parts: [{ text: prompt }] }];

    const response = await callGeminiAPI(modelName, contents, {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            valueProposition: { type: Type.STRING },
            emailSubject: { type: Type.STRING },
            emailBody: { type: Type.STRING },
            phoneScript: { type: Type.STRING },
            cadence: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.NUMBER },
                  channel: { type: Type.STRING, enum: ["email", "linkedin", "phone"] },
                  subject: { type: Type.STRING },
                  content: { type: Type.STRING }
                }
                }
            }
            }
        }
    });

    const json = await response.json();
    const text = json.text || json.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      const result = JSON.parse(text);
      memoryCache.set(cacheKey, result);
      return result;
    }
    return null;
  } catch (error) {
    console.error("Sales Kit Error:", error);
    return null;
  }
};

export const analyzeCompetitors = async (companyName: string): Promise<Competitor[]> => {
  const cacheKey = generateCacheKey('analyzeCompetitors', companyName);
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  try {
    const prompt = `Liste 3 concorrentes diretos ou indiretos para ${companyName} no mercado brasileiro e seu ponto forte principal.`;

    const contents = [{ role: 'user', parts: [{ text: prompt }] }];

    const response = await callGeminiAPI(modelName, contents, {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              strength: { type: Type.STRING }
            }
          }
        }
    });

    const json = await response.json();
    const text = json.text || json.candidates?.[0]?.content?.parts?.[0]?.text;

    if (text) {
      const result = JSON.parse(text);
      memoryCache.set(cacheKey, result);
      return result;
    }
    return [];
  } catch (error) {
    console.error("Competitor Analysis Error:", error);
    return [];
  }
};

export const checkLocationData = async (companyName: string, city: string) => {
  try {
    const contents = [{ role: 'user', parts: [{ text: `Find the exact address, rating and recent reviews for ${companyName} in ${city}.` }] }];
    const response = await callGeminiAPI("gemini-1.5-flash", contents, {
        tools: [{ googleMaps: {} }],
    });
    return response.text;
  } catch (error) {
    console.error("Maps Error:", error);
    return "Não foi possível validar a localização.";
  }
};

export const generateMarketingImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K", aspectRatio: string = "1:1") => {
  try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch('/api/generate-image', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
          },
          body: JSON.stringify({ prompt, size, aspectRatio })
      });

      if (!response.ok) throw new Error("Image gen failed");
      const data = await response.json();
      return data.images?.[0]?.url || null;
  } catch (error) {
      console.error("Image Gen Error:", error);
      return null;
  }
};

export const generateVideoAsset = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') => {
  console.warn("Video Generation disabled: Requires Veo model which is currently in restricted preview.");
  return null;
};

export const generateSpeech = async (text: string) => {
  console.warn("TTS disabled: Requires Vertex AI or specialized model.");
  return null;
};

export const deepReasoning = async (query: string) => {
  try {
    const contents = [{ role: 'user', parts: [{ text: query }] }];
    const response = await callGeminiAPI("gemini-1.5-pro", contents);
    return response.text;
  } catch (error) {
    console.error("Thinking Error:", error);
    return "Erro no raciocínio profundo.";
  }
};

export const transcribeAudio = async (base64Audio: string, mimeType: string) => {
  try {
    const contents = {
        parts: [
          { inlineData: { mimeType, data: base64Audio } },
          { text: "Transcribe this audio precisely." }
        ]
      };

    const response = await callGeminiAPI(modelName, contents);
    return response.text;
  } catch (error) {
    console.error("Transcription Error:", error);
    return "Erro na transcrição.";
  }
};

export const analyzeVisualContent = async (base64Data: string, mimeType: string, prompt: string) => {
    try {
        const contents = {
                parts: [
                    { inlineData: { mimeType, data: base64Data } },
                    { text: prompt }
                ]
            };
        const response = await callGeminiAPI('gemini-1.5-pro', contents);
        return response.text;
    } catch (error) {
        console.error("Visual Analysis Error:", error);
        return "Erro na análise visual.";
    }
}

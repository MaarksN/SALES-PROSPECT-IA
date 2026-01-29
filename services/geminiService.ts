
import { GoogleGenAI, Type, Modality, GenerateContentResponse, Schema } from "@google/genai";
import { Lead, SalesKit, Competitor, DecisionMaker, AIToolConfig, UserContext, BirthubDossier, BirthubAnalysisResult, GroundingSource } from '../types';

/**
 * SECURITY WARNING:
 * The API_KEY is currently read from process.env on the client-side.
 * In a production environment, this exposes your API key to users.
 *
 * RECOMMENDED FIX:
 * Implement a Backend-for-Frontend (BFF) pattern:
 * 1. Create a server (Node.js/Express, Next.js API Routes, etc.).
 * 2. Move these API calls to the server.
 * 3. The frontend should call your server endpoints (e.g., /api/generate).
 * 4. Store the API_KEY only in the server environment variables.
 */

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using stable model version
const modelName = 'gemini-1.5-flash';

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

// Simple in-memory LRU cache to prevent memory leaks and shared state
class SimpleLRUCache {
  private cache = new Map<string, any>();
  private readonly maxSize: number;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  get(key: string): any {
    if (!this.cache.has(key)) return undefined;
    const value = this.cache.get(key);
    // Refresh LRU: delete and set again to move to end of Map
    this.cache.delete(key);
    this.cache.set(key, value);
    // Return deep copy to prevent side effects
    return JSON.parse(JSON.stringify(value));
  }

  set(key: string, value: any): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove oldest (first inserted/accessed)
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }
}

const memoryCache = new SimpleLRUCache(50);

const generateCacheKey = (prefix: string, ...args: any[]) => {
  return `${prefix}:${JSON.stringify(args)}`;
};

/**
 * Helper to convert simplified schema to Gemini API Schema
 */
const convertToGeminiSchema = (simpleSchema: Record<string, string>): Schema => {
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
       // Generic object for simplicity in this helper
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
 * Now supports User Context Injection and Structured JSON Output.
 */
export const executeSalesTool = async (
  tool: AIToolConfig, 
  inputs: Record<string, string>,
  userContext?: UserContext
): Promise<string> => {
  return executeAITool(
    tool.promptTemplate, 
    inputs, 
    tool.systemRole || 'Sales Assistant', 
    userContext,
    tool.outputSchema
  );
};

/**
 * 🚀 MOTOR DE EXECUÇÃO DAS 100 FERRAMENTAS (ATUALIZADO)
 * Inclui injeção de contexto e suporte a Schema JSON.
 */
export const executeAITool = async (
  promptTemplate: string, 
  inputs: Record<string, string>, 
  systemRole: string = 'Assistente de Vendas de Alta Performance',
  userContext?: UserContext,
  simpleSchema?: Record<string, string>
): Promise<string> => {
  const cacheKey = generateCacheKey('executeAITool', promptTemplate, inputs, systemRole, userContext, simpleSchema);
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  try {
    // 1. Interpolação de Variáveis
    let finalPrompt = promptTemplate;
    Object.keys(inputs).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      finalPrompt = finalPrompt.replace(regex, inputs[key] || '');
    });

    // 2. Injeção de Contexto (O "Cérebro" do Usuário)
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

    // 4. Configuração da Chamada
    const generateConfig: GenerateConfig = {
      temperature: 0.7,
    };

    // Support JSON Schema if provided
    if (simpleSchema) {
      generateConfig.responseMimeType = "application/json";
      generateConfig.responseSchema = convertToGeminiSchema(simpleSchema);
    }

    // 5. Chamada à API
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        { 
            role: 'user', 
            parts: [{ text: `SYSTEM ROLE: ${enrichedSystemRole}\n\n--- TAREFA ---\n${finalPrompt}` }] 
        }
      ],
      config: generateConfig
    });

    let textResponse = response.text || "Sem resposta gerada.";

    // Pretty Print JSON if applicable
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
 * 🕵️‍♂️ BIRTHUB AI v2.1 ENGINE (LEADHUNTER CORE)
 * O núcleo cognitivo para inteligência B2B.
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

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: `TARGET PARA ANÁLISE PROFUNDA: ${target}`,
      config: {
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
    });

    if (response.text) {
      const dossier = JSON.parse(response.text) as BirthubDossier;
      
      // Extract grounding sources for evidence validation
      const sources: GroundingSource[] = [];
      if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
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

    const chat = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction: systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
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

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
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
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text);
      memoryCache.set(cacheKey, result);
      return result;
    }
    return [];
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return [];
  }
};

/**
 * FEATURE 30: Decision Maker Matching (Enrichment)
 */
export const enrichDecisionMakers = async (companyName: string): Promise<DecisionMaker[]> => {
  const cacheKey = generateCacheKey('enrichDecisionMakers', companyName);
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  try {
    const prompt = `Identifique cargos prováveis de tomadores de decisão na empresa ${companyName}. 
    Foque em Diretores, Gerentes e C-Level. Retorne 3 personas.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
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
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text);
      memoryCache.set(cacheKey, result);
      return result;
    }
    return [];
  } catch (error) {
    console.error("Enrichment Error:", error);
    return [];
  }
};

/**
 * FEATURE 23, 25, 32, 33: Full Sales Machine (Cadence, Scripts, Email)
 */
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

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
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
            },
            objectionHandling: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  objection: { type: Type.STRING },
                  response: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text);
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

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
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
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text);
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
  const cacheKey = generateCacheKey('checkLocationData', companyName, city);
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Find the exact address, rating and recent reviews for ${companyName} in ${city}.`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });
    memoryCache.set(cacheKey, response.text);
    return response.text;
  } catch (error) {
    console.error("Maps Error:", error);
    return "Não foi possível validar a localização.";
  }
};

export const generateMarketingImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K", aspectRatio: string = "1:1") => {
  console.warn("Image Generation disabled: Requires specialized Imagen model.");
  return null;
};

export const generateVideoAsset = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') => {
  try {
    const freshAi = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let operation = await freshAi.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        aspectRatio: aspectRatio
      }
    });

    const pollIntervals = [1000, 2000, 4000, 5000];
    let attempt = 0;

    while (!operation.done) {
      const interval = pollIntervals[Math.min(attempt, pollIntervals.length - 1)];
      await new Promise(resolve => setTimeout(resolve, interval));
      operation = await freshAi.operations.getVideosOperation({ operation: operation });
      attempt++;
    }

    return operation.response;
  } catch (error) {
    console.error("Video Generation Error:", error);
    return null;
  }
};

export const generateSpeech = async (text: string) => {
  console.warn("TTS disabled: Requires Vertex AI or specialized model.");
  return null;
};

export const deepReasoning = async (query: string) => {
  const cacheKey = generateCacheKey('deepReasoning', query);
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-pro",
      contents: query,
      // Removed thinkingConfig as it's not standard in 1.5 stable
    });
    memoryCache.set(cacheKey, response.text);
    return response.text;
  } catch (error) {
    console.error("Thinking Error:", error);
    return "Erro no raciocínio profundo.";
  }
};

export const transcribeAudio = async (base64Audio: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Audio } },
          { text: "Transcribe this audio precisely." }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Transcription Error:", error);
    return "Erro na transcrição.";
  }
};

export const analyzeVisualContent = async (base64Data: string, mimeType: string, prompt: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-pro',
            contents: {
                parts: [
                    { inlineData: { mimeType, data: base64Data } },
                    { text: prompt }
                ]
            }
        });
        return response.text;
    } catch (error) {
        console.error("Visual Analysis Error:", error);
        return "Erro na análise visual.";
    }
}

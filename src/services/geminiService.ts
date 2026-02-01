import { api } from "@/lib/api";
import { UserContext } from "@/types";

// Cache em memória para evitar requests repetidos na mesma sessão
const responseCache = new Map<string, string>();

interface GenerateOptions {
  temperature?: number;
  stream?: boolean; // Preparação para futuro
}

class GeminiService {
  private SYSTEM_INSTRUCTION = `
    Você é um SDR Senior (Sales Development Representative) especialista em vendas B2B.
    Seu objetivo é criar conexões humanas, profissionais e persuasivas.
    Use frameworks comprovados (AIDA, SPIN, GPCT).
    Evite clichês de vendas e linguagem excessivamente formal ou robótica.
    Sempre adapte o tom ao contexto da empresa do prospect.
  `;

  // Método genérico para o AI Lab
  async generateText(prompt: string, options?: GenerateOptions): Promise<string> {
    try {
      const { temperature = 0.7 } = options || {};

      const response = await api.post("/ai/generate", {
        prompt,
        systemInstruction: this.SYSTEM_INSTRUCTION,
        config: {
            temperature,
            // stream: options?.stream
        }
      });
      return response.data.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new Error("Falha na comunicação com a IA.");
    }
  }

  async generateColdMail(leadName: string, leadCompany: string, context: UserContext): Promise<string> {
    const cacheKey = `mail-${leadName}-${leadCompany}-${context.myProduct}`;
    if (responseCache.has(cacheKey)) return responseCache.get(cacheKey)!;

    const prompt = `
      Escreva um e-mail frio para ${leadName} da ${leadCompany}.
      Eu vendo: ${context.myProduct}.
      Minha empresa: ${context.myCompany}.

      Framework: AIDA.
      Tom: Profissional, mas conversacional.
      Foco: Dor e Solução, não funcionalidades.
    `;

    // Emails criativos requerem temperatura maior
    const text = await this.generateText(prompt, { temperature: 0.9 });
    responseCache.set(cacheKey, text);
    return text;
  }

  async analyzeFit(companyData: string, icp: string): Promise<{ score: number; reason: string }> {
    const prompt = `
      Analise o fit desta empresa: "${companyData}" com este ICP: "${icp}".
      Retorne APENAS JSON: { "score": number, "reason": "string" }
    `;

    try {
        // Análise requer precisão, temperatura baixa
        const text = await this.generateText(prompt, { temperature: 0.2 });
        const cleanText = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanText);
    } catch (e) {
        return { score: 0, reason: "Erro ao processar resposta da IA" };
    }
  }
}

export const geminiService = new GeminiService();

import { api } from "@/lib/api";
import { UserContext } from "@/types";

const responseCache = new Map<string, string>();

class GeminiService {
  constructor() {}

  // Método genérico para o AI Lab
  async generateText(prompt: string): Promise<string> {
    try {
      const response = await api.post("/ai/generate", { prompt });
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
      Atue como SDR Senior. Escreva um e-mail frio para ${leadName} da ${leadCompany}.
      Vendo: ${context.myProduct}.
      Contexto: ${context.myCompany}.
      Tom: Profissional e Persuasivo.
      Use Framework: AIDA.
    `;

    const text = await this.generateText(prompt);
    responseCache.set(cacheKey, text);
    return text;
  }

  async analyzeFit(companyData: string, icp: string): Promise<{ score: number; reason: string }> {
    const prompt = `
      Analise o fit desta empresa: "${companyData}" com este ICP: "${icp}".
      Retorne APENAS JSON: { "score": number, "reason": "string" }
    `;

    try {
        const text = await this.generateText(prompt);
        const cleanText = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanText);
    } catch (e) {
        return { score: 0, reason: "Erro ao processar resposta da IA" };
    }
  }
}

export const geminiService = new GeminiService();

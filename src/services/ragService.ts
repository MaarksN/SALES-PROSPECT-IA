import { api } from "@/lib/api";

interface ContextDocument {
  id: string;
  content: string;
  relevanceScore: number;
  metadata: Record<string, any>;
}

class RagService {
  // Simula busca vetorial (em produção chamaria endpoint /api/rag/search)
  async retrieveContext(query: string, filters?: Record<string, any>): Promise<string> {
    try {
        // Exemplo de chamada real futura:
        // const docs = await api.post("/rag/search", { query, filters });

        // Mock para ciclo atual
        const docs: ContextDocument[] = [
            {
                id: "1",
                content: "Nossa empresa foca em reduzir CAC em 30%.",
                relevanceScore: 0.95,
                metadata: { type: "case_study" }
            },
            {
                id: "2",
                content: "Temos integração nativa com HubSpot.",
                relevanceScore: 0.88,
                metadata: { type: "feature" }
            }
        ];

        // Filtra por relevância mínima (0.8)
        const relevantDocs = docs.filter(d => d.relevanceScore > 0.8);

        if (relevantDocs.length === 0) return "";

        // Formata Context Injection
        return `
        CONTEXTO CONHECIMENTO INTERNO (Use se relevante):
        ${relevantDocs.map(d => `- ${d.content}`).join("\n")}
        `;

    } catch (error) {
        console.warn("RAG retrieval failed, proceeding without context.");
        return "";
    }
  }

  async enrichPromptWithContext(basePrompt: string, query: string): Promise<string> {
    const context = await this.retrieveContext(query);
    if (!context) return basePrompt;

    return `${context}\n\nINSTRUÇÃO DO USUÁRIO:\n${basePrompt}`;
  }
}

export const ragService = new RagService();

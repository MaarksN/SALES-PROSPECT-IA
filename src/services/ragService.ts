import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

export const ragService = {
  async searchContext(query: string): Promise<string> {
    // 1. Gera Embedding da Query usando Gemini (Real)
    // Nota: Requer que o modelo "text-embedding-004" esteja habilitado na sua chave
    // Para simplificar este MVP, pularemos a geração do embedding no frontend
    // e chamaremos uma RPC que faria isso ou uma busca full-text.

    try {
        // Chamada Real ao Postgres (pgvector)
        // Você precisa criar a função 'match_documents' no seu Supabase
        const { data, error } = await supabase.rpc('match_documents', {
            query_text: query, // Se usar Full Text Search
            match_threshold: 0.7,
            match_count: 5
        });

        if (error) {
            console.warn("RAG Error (RPC não encontrada?):", error.message);
            return "";
        }

        if (!data || data.length === 0) return "";

        return data.map((d: any) => d.content).join("\n\n");
    } catch (err) {
        return "";
    }
  }
};
import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";
import { Lead } from "@/types";

// Inicialização segura do cliente
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

export const leadService = {
  /**
   * Busca leads com paginação e filtros.
   */
  async getLeads(page = 1, pageSize = 20, query = ""): Promise<Lead[]> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    try {
      let req = supabase
        .from("leads")
        .select("*")
        .range(from, to)
        .order("created_at", { ascending: false });

      if (query) {
        req = req.or(`name.ilike.%${query}%,company.ilike.%${query}%`);
      }

      const { data, error } = await req;

      if (error) throw error;
      return (data as unknown as Lead[]) || [];
    } catch (err) {
      console.error("Erro ao buscar leads:", err);
      // Retornar array vazio em caso de erro para não quebrar a UI
      return [];
    }
  },

  /**
   * Adiciona um novo lead manualmente ou via importação.
   */
  async addLead(lead: Partial<Lead>): Promise<Lead | null> {
    const { data, error } = await supabase
      .from("leads")
      .insert([lead])
      .select()
      .single();

    if (error) {
        console.error("Erro ao inserir lead:", error);
        return null;
    }
    return data;
  },

  /**
   * Atualiza o status de um lead (ex: Funil de vendas).
   */
  async updateStatus(id: string, status: Lead["status"]): Promise<boolean> {
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", id);

    return !error;
  }
};
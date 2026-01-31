import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";
import { UserContext } from "@/types";

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

class AutopilotService {
  async startQueue(leads: any[], context: UserContext, onProgress: (c: number) => void) {
    console.log(`[Autopilot] Agendando ${leads.length} jobs...`);

    const jobs = leads.map(lead => ({
      user_id: context.id,
      type: "generate_cold_mail",
      payload: {
        leadName: lead.name,
        leadCompany: lead.company,
        myProduct: context.companyName || "Nosso Produto"
      },
      status: "pending"
    }));

    const { error } = await supabase.from("jobs").insert(jobs);

    if (error) {
      console.error("Erro ao agendar jobs:", error);
      throw error;
    }

    // Feedback imediato que foi agendado
    onProgress(leads.length);
    console.log("[Autopilot] Jobs enviados para a fila com sucesso.");
  }
}

export const autopilotService = new AutopilotService();

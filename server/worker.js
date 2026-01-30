import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configuração correta do dotenv para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

async function processQueue() {
  const { data: job, error } = await supabase
    .from("jobs")
    .update({ status: "processing", updated_at: new Date() })
    .eq("status", "pending")
    .limit(1)
    .select()
    .single();

  if (!job) return;

  console.log(`[Worker] Processando Job ${job.id}: ${job.type}`);

  try {
    let result = null;

    if (job.type === "generate_cold_mail") {
      const { leadName, leadCompany, myProduct } = job.payload;
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Escreva um email frio curto para ${leadName} da ${leadCompany} oferecendo ${myProduct}.`;
      const aiResponse = await model.generateContent(prompt);
      result = { emailContent: aiResponse.response.text() };
    }

    await supabase.from("jobs").update({
      status: "completed",
      result: result,
      updated_at: new Date()
    }).eq("id", job.id);

    console.log(`[Worker] Job ${job.id} concluído.`);

  } catch (err) {
    console.error(`[Worker] Erro no Job ${job.id}:`, err);
    await supabase.from("jobs").update({
      status: "failed",
      error_message: err.message
    }).eq("id", job.id);
  }
}

console.log("🚀 Worker de IA iniciado...");
setInterval(processQueue, 2000);

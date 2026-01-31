import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Monitora jobs travados em 'processing' por muito tempo (ex: crash do worker)
async function monitorStuckJobs() {
    const TIMEOUT_THRESHOLD_MINUTES = 10;
    const thresholdDate = new Date(Date.now() - TIMEOUT_THRESHOLD_MINUTES * 60000).toISOString();

    const { data: stuckJobs, error } = await supabase
        .from('jobs')
        .select('id, attempts, max_attempts')
        .eq('status', 'processing')
        .lt('updated_at', thresholdDate);

    if (error) {
        console.error("Monitor Error:", error);
        return;
    }

    if (stuckJobs && stuckJobs.length > 0) {
        console.warn(`Found ${stuckJobs.length} stuck jobs. Recovering...`);

        for (const job of stuckJobs) {
            // Se ainda tem tentativas, volta pra pending
            if (job.attempts < job.max_attempts) {
                 await supabase.from('jobs').update({
                    status: 'pending',
                    updated_at: new Date().toISOString(),
                    last_error: 'Job stuck in processing (Worker Crash?)'
                 }).eq('id', job.id);
            } else {
                 await supabase.from('jobs').update({
                    status: 'failed',
                    finished_at: new Date().toISOString(),
                    last_error: 'Job stuck and max attempts reached'
                 }).eq('id', job.id);
            }
        }
    }
}

// Roda a cada 5 min
setInterval(monitorStuckJobs, 5 * 60000);
console.log("Job Monitor started.");

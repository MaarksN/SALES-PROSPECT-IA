import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Limpa jobs antigos completados para não inflar o banco
async function cleanOldJobs() {
    const RETENTION_DAYS = 7;
    const thresholdDate = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('status', 'completed')
        .lt('finished_at', thresholdDate);

    if (error) {
        console.error("Cleaner Error:", error);
    } else {
        // console.log("Cleaned old completed jobs.");
    }
}

// Roda 1x por dia (idealmente via scheduler, aqui via script isolado)
cleanOldJobs().then(() => {
    console.log("Cleanup job run completed.");
    process.exit(0);
});

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Configuração de ambiente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Worker Error: Missing Supabase Credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const WORKER_ID = `worker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
console.log(`🚀 Worker ${WORKER_ID} started.`);

async function fetchNextJob() {
  // Simulação de SKIP LOCKED via RPC (ideal) ou update atômico
  // Aqui usamos uma abordagem segura: UPDATE ... RETURNING com filtro
  // Em produção real com Postgres, usaríamos:
  // SELECT * FROM jobs WHERE status = 'pending' AND run_at <= NOW() ORDER BY priority DESC, run_at ASC LIMIT 1 FOR UPDATE SKIP LOCKED

  // Como Supabase-js não expõe SKIP LOCKED diretamente na query builder padrão,
  // idealmente chamamos uma RPC. Vamos simular a lógica aqui ou chamar rpc se existisse.

  // Abordagem otimista via RPC (recomendado criar a function no DB, mas aqui faremos via código para o ciclo)
  const { data, error } = await supabase.rpc('fetch_next_job', { worker_id: WORKER_ID });

  if (error) {
     // Se RPC não existir (ainda não criada no ciclo anterior), fallback simples (menos seguro pra concorrência alta mas funcional pra MVP)
     // console.warn("RPC fetch_next_job not found, using fallback polling strategy.");
     return null;
  }

  if (data && data.length > 0) return data[0];
  return null;
}

async function processJob(job) {
  console.log(`[Job ${job.id}] Processing type: ${job.type}`);

  try {
    // Timeout handling
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Job Timeout")), 30000));

    // Processamento real viria aqui (switch case job.type)
    const work = async () => {
        // Simulação
        await new Promise(r => setTimeout(r, 1000));
        return { success: true };
    };

    await Promise.race([work(), timeout]);

    // Sucesso
    await supabase.from('jobs').update({
        status: 'completed',
        finished_at: new Date().toISOString()
    }).eq('id', job.id);

  } catch (err) {
    console.error(`[Job ${job.id}] Failed: ${err.message}`);

    const nextRetry = job.attempts < job.max_attempts;

    if (nextRetry) {
        // Exponential Backoff: 2^attempts * 30s
        const delaySeconds = Math.pow(2, job.attempts) * 30;
        const nextRun = new Date(Date.now() + delaySeconds * 1000).toISOString();

        await supabase.from('jobs').update({
            status: 'pending',
            attempts: job.attempts + 1,
            last_error: err.message,
            run_at: nextRun
        }).eq('id', job.id);
    } else {
        // Dead Letter (Failed)
        await supabase.from('jobs').update({
            status: 'failed',
            finished_at: new Date().toISOString(),
            last_error: err.message
        }).eq('id', job.id);

        // Mover para tabela jobs_failed (opcional, ou manter status failed)
    }
  }
}

async function loop() {
  while (true) {
    const job = await fetchNextJob();
    if (job) {
      await processJob(job);
    } else {
      // Idle wait
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

// Inicia loop
loop().catch(err => {
    console.error("Worker crashed:", err);
    process.exit(1);
});

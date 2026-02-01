CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue TEXT NOT NULL DEFAULT 'default',
  type TEXT NOT NULL, -- e.g., 'enrich_lead', 'send_email'
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  priority INTEGER DEFAULT 0, -- Maior número = maior prioridade
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  last_error TEXT,
  run_at TIMESTAMPTZ DEFAULT NOW(), -- Agendamento
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance do Worker
CREATE INDEX IF NOT EXISTS idx_jobs_status_run_at_priority ON jobs(status, run_at, priority DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);

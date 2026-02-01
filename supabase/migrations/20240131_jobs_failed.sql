CREATE TABLE IF NOT EXISTS jobs_failed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_job_id UUID,
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  error_message TEXT,
  stack_trace TEXT,
  failed_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_jobs_failed_type ON jobs_failed(type);
CREATE INDEX IF NOT EXISTS idx_jobs_failed_date ON jobs_failed(failed_at);

-- Trigger opcional: Mover automaticamente de jobs -> jobs_failed quando status = 'failed'
-- (Para manter a tabela jobs leve, ou pode ser feito via cron job de limpeza)

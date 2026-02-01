-- Função auxiliar para o worker buscar jobs com SKIP LOCKED
CREATE OR REPLACE FUNCTION fetch_next_job(worker_id TEXT)
RETURNS TABLE (
  id UUID,
  type TEXT,
  payload JSONB,
  attempts INTEGER,
  max_attempts INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  UPDATE jobs
  SET status = 'processing',
      started_at = NOW(),
      updated_at = NOW()
  WHERE id = (
    SELECT id
    FROM jobs
    WHERE status = 'pending'
      AND run_at <= NOW()
    ORDER BY priority DESC, run_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING id, type, payload, attempts, max_attempts;
END;
$$;

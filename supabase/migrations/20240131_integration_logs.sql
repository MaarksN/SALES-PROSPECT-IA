-- Logs de Integração (Auditoria técnica)
CREATE TABLE IF NOT EXISTS integration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL, -- 'hubspot', 'stripe', 'clearbit'
  endpoint TEXT,
  status_code INTEGER,
  request_payload JSONB,
  response_payload JSONB,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_integration_logs_service ON integration_logs(service);
CREATE INDEX IF NOT EXISTS idx_integration_logs_created_at ON integration_logs(created_at);

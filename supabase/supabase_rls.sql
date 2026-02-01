-- Habilita RLS nas tabelas principais
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_ledger ENABLE ROW LEVEL SECURITY;

-- Policy: Admin tem acesso total (exemplo baseado em claim 'app_metadata')
CREATE POLICY "Admins can do everything" ON subscriptions
  TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Policy: Usuários veem seus próprios dados
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own ledger" ON credit_ledger
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Leads Read-Only se assinatura expirada (Exemplo conceitual, requer função de check)
-- CREATE POLICY "Read only leads if expired" ON leads
--   FOR SELECT TO authenticated
--   USING (auth.uid() = user_id);
--   -- O bloqueio de INSERT/UPDATE seria feito em outra policy verificando status

-- Auditoria (Logs do Sistema)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Ninguém pode apagar logs de auditoria
-- Apenas insert pelo sistema (Service Role) ou Admin leitura
CREATE POLICY "Admins view audit logs" ON audit_logs
  FOR SELECT TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- Nenhuma policy de INSERT/UPDATE/DELETE para authenticated (apenas service role)

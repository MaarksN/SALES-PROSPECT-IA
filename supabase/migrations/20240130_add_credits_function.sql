CREATE OR REPLACE FUNCTION add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER -- Roda como superusuário para garantir integridade
AS $$
DECLARE
  v_new_balance INTEGER;
  v_current_balance INTEGER;
BEGIN
  -- Bloquear crédito negativo na adição (deve usar consume_credits para remover)
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive for add_credits';
  END IF;

  -- Obter saldo atual (com lock para evitar race condition)
  -- Assumindo existência de tabela 'profiles' ou similar com campo 'credits'
  -- Se não existir, criamos mock na tabela users_credits (exemplo)

  -- Exemplo usando uma tabela dedicada users_credits
  -- INSERT INTO users_credits (user_id, credits) VALUES (p_user_id, 0) ON CONFLICT DO NOTHING;

  SELECT credits INTO v_current_balance FROM profiles WHERE id = p_user_id FOR UPDATE;

  IF v_current_balance IS NULL THEN
     v_current_balance := 0;
     -- Se não existir perfil, talvez criar ou falhar. Aqui assumimos 0.
  END IF;

  v_new_balance := v_current_balance + p_amount;

  -- Atualizar saldo
  UPDATE profiles SET credits = v_new_balance, updated_at = NOW() WHERE id = p_user_id;

  -- Inserir no Ledger
  INSERT INTO credit_ledger (user_id, amount, balance_after, description, metadata)
  VALUES (p_user_id, p_amount, v_new_balance, p_description, p_metadata);

  RETURN v_new_balance;
END;
$$;

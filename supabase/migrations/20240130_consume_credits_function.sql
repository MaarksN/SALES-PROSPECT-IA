CREATE OR REPLACE FUNCTION consume_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive (it represents cost)';
  END IF;

  -- Lock na linha do usuário
  SELECT credits INTO v_current_balance FROM profiles WHERE id = p_user_id FOR UPDATE;

  IF v_current_balance IS NULL OR v_current_balance < p_amount THEN
    -- Falha atômica: não consome nada se não tiver saldo suficiente
    RETURN FALSE;
  END IF;

  v_new_balance := v_current_balance - p_amount;

  UPDATE profiles SET credits = v_new_balance, updated_at = NOW() WHERE id = p_user_id;

  INSERT INTO credit_ledger (user_id, amount, balance_after, description, metadata)
  VALUES (p_user_id, -p_amount, v_new_balance, p_description, p_metadata);

  RETURN TRUE;
END;
$$;

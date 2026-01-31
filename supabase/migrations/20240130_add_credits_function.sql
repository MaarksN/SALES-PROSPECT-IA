-- Função para adicionar créditos ao usuário de forma segura no banco de dados
CREATE OR REPLACE FUNCTION public.add_user_credits(user_id_param UUID, amount INT)
RETURNS void AS import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Webhook do Stripe para processar pagamentos e atualizar créditos
 */
router.post('/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const event = JSON.parse(req.body);

  if (event.type === 'checkout.session.completed') {
    const userId = event.data.object.client_reference_id;
    // Chama a função RPC no Supabase para adicionar créditos
    const { error } = await supabase.rpc('add_user_credits', {
        user_id_param: userId,
        amount: 500
    });

    if (error) console.error('Erro ao adicionar créditos:', error);
  }
  res.json({received: true});
});

export default router;
BEGIN
  UPDATE public.subscriptions
  SET credits_balance = credits_balance + amount,
      updated_at = NOW()
  WHERE id = user_id_param;
END;
import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Webhook do Stripe para processar pagamentos e atualizar créditos
 */
router.post('/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const event = JSON.parse(req.body);

  if (event.type === 'checkout.session.completed') {
    const userId = event.data.object.client_reference_id;
    // Chama a função RPC no Supabase para adicionar créditos
    const { error } = await supabase.rpc('add_user_credits', {
        user_id_param: userId,
        amount: 500
    });

    if (error) console.error('Erro ao adicionar créditos:', error);
  }
  res.json({received: true});
});

export default router; LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.add_user_credits IS 'Adiciona créditos ao saldo do usuário via backend/webhooks.';

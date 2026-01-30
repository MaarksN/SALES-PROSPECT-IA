-- Habilita RLS nas tabelas
alter table public.leads enable row level security;
alter table public.subscriptions enable row level security;

-- Política: Usuário só vê seus próprios leads
create policy "Leads are private to user"
  on public.leads for all
  using (auth.uid() = user_id);

-- Política: Usuário só vê sua própria assinatura
create policy "Subscriptions are private to user"
  on public.subscriptions for select
  using (auth.uid() = id);

-- Política: Apenas o backend (service role) pode atualizar créditos via Webhook
-- (Usuários não podem editar seus próprios créditos manualmente)
-- Tabela de Assinaturas e Créditos
create table public.subscriptions (
  id uuid references auth.users not null primary key,
  plan_id text not null default 'free',
  status text not null default 'active',
  credits_balance int not null default 50,
  current_period_end timestamptz,
  stripe_customer_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger: Quando um novo usuário se cadastra, cria a entrada na tabela subscriptions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.subscriptions (id, plan_id, credits_balance)
  values (new.id, 'free', 50);
  return new;
end;
$$ language plpgsql security definer;

-- Aciona o trigger na tabela auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
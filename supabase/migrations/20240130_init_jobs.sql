-- 1. Enum para status do job
DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('pending', 'processing', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Tabela de Jobs (Fila)
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  type text not null,
  payload jsonb not null,
  status job_status default 'pending',
  result jsonb,
  error_message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Segurança (RLS)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own jobs" ON public.jobs;
CREATE POLICY "Users manage own jobs"
ON public.jobs
FOR ALL
USING (auth.uid() = user_id);

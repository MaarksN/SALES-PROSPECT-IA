-- Enable RLS for the leads table
-- This script assumes your table is named 'leads' and uses camelCase column names (quoted identifiers) matching the TypeScript interface.

-- 1. Add userId column to link leads to Supabase Auth users
ALTER TABLE leads ADD COLUMN IF NOT EXISTS "userId" UUID REFERENCES auth.users(id);

-- 2. Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 3. Create Policies

-- Allow users to view only their own leads
CREATE POLICY "Users can view own leads"
ON leads FOR SELECT
USING (auth.uid() = "userId");

-- Allow users to insert leads only if they are the owner
CREATE POLICY "Users can insert own leads"
ON leads FOR INSERT
WITH CHECK (auth.uid() = "userId");

-- Allow users to update only their own leads
CREATE POLICY "Users can update own leads"
ON leads FOR UPDATE
USING (auth.uid() = "userId");

-- Allow users to delete only their own leads
CREATE POLICY "Users can delete own leads"
ON leads FOR DELETE
USING (auth.uid() = "userId");

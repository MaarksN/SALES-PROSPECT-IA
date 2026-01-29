-- Create Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'canceled', 'past_due'
    plan TEXT NOT NULL DEFAULT 'free', -- 'free', 'pro', 'enterprise'
    current_period_end TIMESTAMP WITH TIME ZONE,
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own subscription
CREATE POLICY "Users can view own subscription"
ON subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Service Role (or specialized admin) can insert/update
-- (Ideally handled by webhook, but for now allowing insert for testing)
CREATE POLICY "Users can insert own subscription (Testing)"
ON subscriptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

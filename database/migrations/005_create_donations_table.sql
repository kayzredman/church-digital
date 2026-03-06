-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'paystack', 'bank_transfer')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT UNIQUE,
  donor_name TEXT,
  donor_email TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_payment_method ON donations(payment_method);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_transaction_id ON donations(transaction_id);

-- Enable Row Level Security
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own donations
CREATE POLICY "Users can read their own donations" ON donations
  FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'authenticated');

-- Allow authenticated users (admin) to create donations
CREATE POLICY "Enable insert for authenticated users" ON donations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to update donations
CREATE POLICY "Enable update for authenticated users" ON donations
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to read all donations
CREATE POLICY "Admins can read all donations" ON donations
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_donations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_donations_timestamp
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_donations_updated_at();

-- Create a view for donation analytics
CREATE OR REPLACE VIEW donation_analytics AS
SELECT
  DATE_TRUNC('month', created_at)::DATE as month,
  payment_method,
  status,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount,
  AVG(amount) as average_amount
FROM donations
GROUP BY DATE_TRUNC('month', created_at), payment_method, status
ORDER BY month DESC;

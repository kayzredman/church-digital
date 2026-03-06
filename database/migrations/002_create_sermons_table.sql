-- Create sermons table
CREATE TABLE IF NOT EXISTS sermons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  speaker TEXT NOT NULL,
  date DATE NOT NULL,
  duration INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sermons_date ON sermons(date DESC);
CREATE INDEX IF NOT EXISTS idx_sermons_speaker ON sermons(speaker);
CREATE INDEX IF NOT EXISTS idx_sermons_created_at ON sermons(created_at DESC);

-- Enable Row Level Security
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Enable read access for all users" ON sermons
  FOR SELECT USING (true);

-- Allow authenticated users (admin) to create sermons
CREATE POLICY "Enable insert for authenticated users" ON sermons
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to update sermons
CREATE POLICY "Enable update for authenticated users" ON sermons
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to delete sermons
CREATE POLICY "Enable delete for authenticated users" ON sermons
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_sermons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sermons_timestamp
  BEFORE UPDATE ON sermons
  FOR EACH ROW
  EXECUTE FUNCTION update_sermons_updated_at();

-- Add category column to sermons table
ALTER TABLE sermons 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Sunday Service' 
CHECK (category IN ('Sunday Service', 'Midweek', 'Special'));

CREATE INDEX IF NOT EXISTS idx_sermons_category ON sermons(category);

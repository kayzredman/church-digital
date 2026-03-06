-- Create event_attendees table for tracking attendance
CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON event_attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_status ON event_attendees(status);
CREATE INDEX IF NOT EXISTS idx_event_attendees_created_at ON event_attendees(created_at DESC);

-- Create unique constraint to prevent duplicate registrations
CREATE UNIQUE INDEX IF NOT EXISTS idx_event_attendees_unique ON event_attendees(event_id, COALESCE(user_id, 'anonymous'::uuid));

-- Enable Row Level Security
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- Allow public read access to attendee counts
CREATE POLICY "Enable read access for all users" ON event_attendees
  FOR SELECT USING (true);

-- Allow authenticated users (admin) to create attendee records
CREATE POLICY "Enable insert for authenticated users" ON event_attendees
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to update attendee records
CREATE POLICY "Enable update for authenticated users" ON event_attendees
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users (admin) to delete attendee records
CREATE POLICY "Enable delete for authenticated users" ON event_attendees
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_event_attendees_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_event_attendees_timestamp
  BEFORE UPDATE ON event_attendees
  FOR EACH ROW
  EXECUTE FUNCTION update_event_attendees_updated_at();

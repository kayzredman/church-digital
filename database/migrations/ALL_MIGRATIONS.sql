-- ============================================================
-- ELIM DIGITAL - COMPLETE DATABASE MIGRATION
-- Run this entire script in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. SERMONS TABLE
-- ============================================================
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

CREATE INDEX IF NOT EXISTS idx_sermons_date ON sermons(date DESC);
CREATE INDEX IF NOT EXISTS idx_sermons_speaker ON sermons(speaker);
CREATE INDEX IF NOT EXISTS idx_sermons_created_at ON sermons(created_at DESC);

ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON sermons
  FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON sermons
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON sermons
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON sermons
  FOR DELETE USING (auth.role() = 'authenticated');

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

-- ============================================================
-- 2. EVENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  capacity INTEGER,
  capacity_type TEXT DEFAULT 'unlimited' CHECK (capacity_type IN ('unlimited', 'limited')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(date DESC);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON events
  FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON events
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON events
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION update_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_timestamp
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_events_updated_at();

-- ============================================================
-- 3. BLOG POSTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  category TEXT DEFAULT 'news' CHECK (category IN ('news', 'events', 'devotion', 'ministry')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for published posts" ON blog_posts
  FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON blog_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON blog_posts
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON blog_posts
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_timestamp
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- ============================================================
-- 4. DONATIONS TABLE
-- ============================================================
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

CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_payment_method ON donations(payment_method);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_transaction_id ON donations(transaction_id);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own donations" ON donations
  FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'authenticated');
CREATE POLICY "Enable insert for authenticated users" ON donations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON donations
  FOR UPDATE USING (auth.role() = 'authenticated');

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

-- ============================================================
-- 5. EVENT ATTENDEES TABLE
-- ============================================================
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

CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON event_attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_status ON event_attendees(status);
CREATE INDEX IF NOT EXISTS idx_event_attendees_created_at ON event_attendees(created_at DESC);

ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON event_attendees
  FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON event_attendees
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON event_attendees
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON event_attendees
  FOR DELETE USING (auth.role() = 'authenticated');

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

-- ============================================================
-- DONE! All tables created successfully.
-- ============================================================

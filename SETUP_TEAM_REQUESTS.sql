-- ============================================
-- TEAM REQUEST FEATURE - DATABASE SETUP
-- ============================================
-- Copy and paste this entire script into Supabase SQL Editor
-- Then click "RUN" to create the tables

-- 1. Team Member Requests Table
CREATE TABLE IF NOT EXISTS team_member_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  posted_by UUID REFERENCES users(id) ON DELETE CASCADE,
  members_needed INTEGER NOT NULL,
  message TEXT,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Join Requests Table
CREATE TABLE IF NOT EXISTS join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_request_id UUID REFERENCES team_member_requests(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_request_id, user_id)
);

-- 3. Create Indexes
CREATE INDEX IF NOT EXISTS idx_team_requests_event ON team_member_requests(event_id);
CREATE INDEX IF NOT EXISTS idx_team_requests_status ON team_member_requests(status);
CREATE INDEX IF NOT EXISTS idx_join_requests_team ON join_requests(team_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_user ON join_requests(user_id);

-- 4. Enable Row Level Security
ALTER TABLE team_member_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
DROP POLICY IF EXISTS "Allow all operations on team_member_requests" ON team_member_requests;
CREATE POLICY "Allow all operations on team_member_requests" ON team_member_requests FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on join_requests" ON join_requests;
CREATE POLICY "Allow all operations on join_requests" ON join_requests FOR ALL USING (true);

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- You can now use the team request feature

-- Team Member Requests (Posted by team leaders looking for members)
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

-- Join Requests (Sent by participants wanting to join a team)
CREATE TABLE IF NOT EXISTS join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_request_id UUID REFERENCES team_member_requests(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_request_id, user_id)
);

-- Indexes
CREATE INDEX idx_team_requests_event ON team_member_requests(event_id);
CREATE INDEX idx_team_requests_status ON team_member_requests(status);
CREATE INDEX idx_join_requests_team ON join_requests(team_id);
CREATE INDEX idx_join_requests_user ON join_requests(user_id);

-- Enable RLS
ALTER TABLE team_member_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow all operations on team_member_requests" ON team_member_requests FOR ALL USING (true);
CREATE POLICY "Allow all operations on join_requests" ON join_requests FOR ALL USING (true);

-- Request Replies Table
CREATE TABLE IF NOT EXISTS request_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES team_member_requests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_replies_request ON request_replies(request_id);

ALTER TABLE request_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on request_replies" ON request_replies FOR ALL USING (true);

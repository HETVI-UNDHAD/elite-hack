-- Event Rounds Table
CREATE TABLE event_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  round_name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, round_number)
);

CREATE INDEX idx_event_rounds_event ON event_rounds(event_id);

ALTER TABLE event_rounds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on event_rounds" ON event_rounds FOR ALL USING (true);

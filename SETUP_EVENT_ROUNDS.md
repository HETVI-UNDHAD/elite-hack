# Quick Setup - Event Rounds Feature

## ⚠️ IMPORTANT: Run Database Migration First!

Before using the event creation wizard, you MUST run the database migration to create the `event_rounds` table.

### Step 1: Run SQL Migration

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Open the file: `backend/database/add_event_rounds.sql`
4. Copy the entire SQL content
5. Paste it into the Supabase SQL Editor
6. Click **Run** or press `Ctrl+Enter`

### SQL to Run:

```sql
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
```

### Step 2: Restart Backend Server

```bash
cd backend
npm start
```

### Step 3: Refresh Frontend

Just refresh your browser - the frontend is ready!

## ✅ Verification

After setup, you should be able to:

1. Go to Admin Dashboard
2. Click "Create Event"
3. See the 3-step wizard:
   - Step 1: Event Details
   - Step 2: Number of Stages
   - Step 3: Stage Configuration

## 🐛 Troubleshooting

### Error: "relation event_rounds does not exist"
- **Solution**: You haven't run the SQL migration. Go back to Step 1.

### Error: "404 Not Found" when adding rounds
- **Solution**: Check that your backend server is running on the correct port (5000)

### Error: "500 Internal Server Error" when viewing events
- **Solution**: Run the SQL migration. The backend is trying to fetch rounds but the table doesn't exist.

### Frontend shows old create event form
- **Solution**: Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

## 📝 Notes

- The feature is backward compatible - existing events without rounds will work fine
- You can skip adding rounds during event creation
- Rounds can be added later (feature coming soon)
- Maximum 10 rounds per event

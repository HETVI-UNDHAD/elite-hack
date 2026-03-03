# 🚀 QUICK SETUP - Team Request Feature

## ⚠️ IMPORTANT: You're getting 500 errors because the database tables don't exist yet!

## Step 1: Create Database Tables (REQUIRED)

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Click on "SQL Editor" in the left sidebar

2. **Run the SQL Script**
   - Open the file: `SETUP_TEAM_REQUESTS.sql`
   - Copy ALL the content
   - Paste it into Supabase SQL Editor
   - Click "RUN" button

3. **Verify Tables Created**
   - Go to "Table Editor" in Supabase
   - You should see two new tables:
     - `team_member_requests`
     - `join_requests`

## Step 2: Restart Backend Server

```bash
# Stop the backend (Ctrl+C)
# Then restart it
cd d:\elite\eventnexus\backend
npm start
```

## Step 3: Test the Feature

1. **Login as a participant**
2. **Go to an event that allows teams** (max_team_size > 1)
3. **Create a team**
4. **You should see "Post Team Request" button**
5. **Click it and post a request**
6. **The request appears in the right panel**

## Step 4: Test Join Request Flow

1. **Login as another participant**
2. **Go to the same event**
3. **See the team request in right panel**
4. **Click "I want to join"**
5. **Login back as team leader**
6. **See the join request notification**
7. **Click "Approve"**
8. **System sends email invitation**

## ✅ That's it!

Once you run the SQL script, the 500 errors will disappear and the feature will work perfectly.

## 🐛 Still Having Issues?

Check backend console for errors:
- Make sure Supabase connection is working
- Verify the tables were created
- Check that all routes are loaded

## 📝 Files Created/Modified

**Backend:**
- `backend/src/models/TeamRequest.js` ✅
- `backend/src/models/JoinRequest.js` ✅
- `backend/src/controllers/teamController.js` ✅ (updated)
- `backend/src/routes/teamRoutes.js` ✅ (updated)

**Frontend:**
- `frontend/src/components/TeamRequestPanel.jsx` ✅
- `frontend/src/services/teamService.js` ✅ (updated)
- `frontend/src/pages/EventDetail.jsx` ✅ (updated)
- `frontend/src/pages/ManageEvent.jsx` ✅ (updated)

**Database:**
- `SETUP_TEAM_REQUESTS.sql` ✅ (RUN THIS FIRST!)

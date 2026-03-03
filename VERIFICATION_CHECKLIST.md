# ✅ Team Request Feature - Verification Checklist

## Current Issue: 500 Internal Server Error

**Root Cause:** Database tables `team_member_requests` and `join_requests` don't exist yet.

## Fix Steps:

### 1. ✅ Run SQL Migration (MOST IMPORTANT!)

Open Supabase SQL Editor and run: `SETUP_TEAM_REQUESTS.sql`

**How to verify it worked:**
- Go to Supabase → Table Editor
- Look for these tables:
  - ✅ `team_member_requests`
  - ✅ `join_requests`

### 2. ✅ Restart Backend Server

```bash
# In backend terminal, press Ctrl+C to stop
# Then run:
npm start
```

**How to verify it worked:**
- Backend console should show: "Server running on port 5000"
- No error messages about missing tables

### 3. ✅ Test in Browser

1. Login to EventNexus
2. Go to any team event (max_team_size > 1)
3. Right panel should appear (no 500 errors)
4. Create a team if you haven't
5. "Post Team Request" button should appear

**How to verify it worked:**
- No 500 errors in browser console
- Right panel loads successfully
- Can post team requests

## Quick Test Commands

### Check if tables exist (in Supabase SQL Editor):
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN ('team_member_requests', 'join_requests');
```

Should return 2 rows.

### Check backend routes (in browser):
```
http://localhost:5000/health
```

Should return: `{"status":"OK","message":"EventNexus API is running"}`

## Common Issues:

### Issue: Still getting 500 errors after running SQL
**Solution:** 
- Verify tables were created in Supabase
- Restart backend server
- Clear browser cache and refresh

### Issue: "Table already exists" error when running SQL
**Solution:** 
- Tables are already created! 
- Just restart backend server
- Refresh browser

### Issue: Backend won't start
**Solution:**
- Check .env file has correct Supabase credentials
- Run `npm install` in backend folder
- Check for syntax errors in new files

## Files to Check:

Backend files (should exist):
- ✅ `backend/src/models/TeamRequest.js`
- ✅ `backend/src/models/JoinRequest.js`
- ✅ `backend/src/controllers/teamController.js` (updated)
- ✅ `backend/src/routes/teamRoutes.js` (updated)

Frontend files (should exist):
- ✅ `frontend/src/components/TeamRequestPanel.jsx`
- ✅ `frontend/src/services/teamService.js` (updated)
- ✅ `frontend/src/pages/EventDetail.jsx` (updated)
- ✅ `frontend/src/pages/ManageEvent.jsx` (updated)

## Success Indicators:

✅ No 500 errors in browser console
✅ Right panel appears on event pages
✅ Can post team requests
✅ Can send join requests
✅ Team leaders see join request notifications
✅ Email invitations sent when approved

## Need Help?

Check backend console logs for detailed error messages.

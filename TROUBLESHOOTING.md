# 🔧 TROUBLESHOOTING - 500 Error Fix

## ❌ Error: Failed to load resource: the server responded with a status of 500

This error means the **database tables haven't been created yet**.

---

## ✅ SOLUTION (2 Minutes)

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard
2. Login to your account
3. Select your project (or the one with URL: https://brnbwnukmnktfrgwiddc.supabase.co)

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New query"** button

### Step 3: Run the Schema
1. Open file: `backend/database/schema.sql`
2. Copy ALL the content (Ctrl+A, Ctrl+C)
3. Paste into Supabase SQL Editor
4. Click **"Run"** button (or press Ctrl+Enter)
5. Wait for success message: "Success. No rows returned"

### Step 4: Verify Tables Created
1. Click **"Table Editor"** in left sidebar
2. You should see 4 tables:
   - users
   - events
   - teams
   - registrations

### Step 5: Restart Backend (if needed)
```bash
# Stop backend (Ctrl+C)
# Start again
cd backend
npm start
```

### Step 6: Test Registration
1. Go to: http://localhost:5173
2. Click "Register"
3. Fill in the form
4. Submit
5. Should work now! ✅

---

## 🔍 How to Verify Database is Setup

### Check in Supabase Dashboard:
1. Go to Table Editor
2. Click on "users" table
3. You should see 1 row (admin user)
4. Email: admin@eventnexus.com

---

## 🆘 Still Getting Errors?

### Check Backend Console
Look for error messages in the terminal where backend is running.

### Common Issues:

**"relation 'users' does not exist"**
- Solution: Run the schema.sql in Supabase

**"Invalid API key"**
- Solution: Check backend/.env has correct SUPABASE_ANON_KEY

**"Connection refused"**
- Solution: Make sure backend is running on port 5000

**"CORS error"**
- Solution: Backend should be running, check FRONTEND_URL in backend/.env

---

## ✅ After Running Schema

You should be able to:
- ✅ Register new users
- ✅ Login as admin (admin@eventnexus.com / admin123)
- ✅ Create events
- ✅ Register for events

---

## 📝 Quick Test

After running schema, test with this:

1. **Register a new user:**
   - Name: Test User
   - Email: test@example.com
   - Password: test123

2. **Login as admin:**
   - Email: admin@eventnexus.com
   - Password: admin123

3. **Create an event:**
   - Go to Admin Dashboard
   - Click "Create New Event"

If all 3 work, you're good to go! 🎉

---

## 🔗 Quick Links

- Supabase Dashboard: https://supabase.com/dashboard
- Your Project: https://brnbwnukmnktfrgwiddc.supabase.co
- Schema File: `backend/database/schema.sql`

---

**After running the schema, refresh your browser and try registering again!**

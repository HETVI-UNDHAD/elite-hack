# 🎯 EventNexus - START HERE

## 🚀 Fastest Way to Get Started

### Option 1: Automated Installation (Recommended)
```bash
# Double-click this file:
install.bat
```
This will install all dependencies automatically!

### Option 2: Manual Installation
```bash
# Backend
cd backend
npm install

# Frontend  
cd frontend
npm install
```

---

## 📋 Setup Checklist

### ☐ Step 1: Install Dependencies
Run `install.bat` or install manually (see above)

### ☐ Step 2: Setup Database ⚠️ IMPORTANT - DO THIS FIRST!
1. Go to https://supabase.com/dashboard
2. Login to your project
3. Click "SQL Editor" in sidebar
4. Open file: `backend/database/schema.sql`
5. Copy all content
6. Paste in SQL Editor
7. Click "Run"
8. Wait for success message

**⚠️ If you skip this step, you'll get 500 errors!**

### ☐ Step 3: Start Backend
```bash
# Double-click:
start-backend.bat

# Or manually:
cd backend
npm start
```
✅ Backend running at: http://localhost:5000

### ☐ Step 4: Start Frontend
```bash
# Double-click:
start-frontend.bat

# Or manually:
cd frontend
npm run dev
```
✅ Frontend running at: http://localhost:5173

### ☐ Step 5: Test the Application
1. Open browser: http://localhost:5173
2. Click "Login"
3. Use credentials:
   - Email: `admin@eventnexus.com`
   - Password: `admin123`
4. You're in! 🎉

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `install.bat` | Install all dependencies |
| `start-backend.bat` | Start backend server |
| `start-frontend.bat` | Start frontend app |
| `QUICKSTART.md` | 5-minute setup guide |
| `SETUP_INSTRUCTIONS.md` | Detailed setup |
| `API_ROUTES.md` | API documentation |
| `AWS_DEPLOYMENT.md` | Deploy to AWS |
| `COMPLETE_DELIVERY.md` | Full project details |

---

## 🔑 Your Credentials

**Supabase:**
- URL: `https://brnbwnukmnktfrgwiddc.supabase.co`
- Key: `sb_publishable_Xc66oET_8WXwlUZcjDpqQw_d9hp3pVS`

**Admin Login:**
- Email: `admin@eventnexus.com`
- Password: `admin123`

---

## 🎯 What to Do First

### As Admin:
1. ✅ Login with admin credentials
2. ✅ Go to "Admin" in navbar
3. ✅ Click "Create New Event"
4. ✅ Fill in event details
5. ✅ Save event

### As Participant:
1. ✅ Click "Register" on homepage
2. ✅ Create your account
3. ✅ Browse "Events"
4. ✅ Click on an event
5. ✅ Register for it

---

## 🆘 Troubleshooting

**Backend won't start?**
- Make sure port 5000 is free
- Check if .env file exists in backend/
- Verify Supabase credentials

**Frontend won't start?**
- Make sure port 5173 is free
- Check if .env file exists in frontend/
- Run `npm install` again

**Can't login?**
- Did you run the database schema?
- Is backend running?
- Check browser console (F12)

**Database errors?**
- Verify schema.sql was executed
- Check Supabase dashboard
- Ensure tables exist

---

## 📚 Full Documentation

- **Quick Start:** `QUICKSTART.md`
- **Setup Guide:** `SETUP_INSTRUCTIONS.md`
- **API Docs:** `API_ROUTES.md`
- **Deployment:** `AWS_DEPLOYMENT.md`
- **Complete Info:** `COMPLETE_DELIVERY.md`

---

## ✨ Features You Get

✅ User Authentication (JWT)
✅ Admin Dashboard
✅ Event Management (Create/Edit/Delete)
✅ Individual Registration
✅ Team Registration
✅ Invite Code System
✅ Registration Approval
✅ Attendance Tracking
✅ Analytics Dashboard
✅ Role-Based Access Control

---

## 🌐 URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

---

## 💡 Pro Tips

1. Use 2 terminal windows (one for backend, one for frontend)
2. Keep Supabase dashboard open for database monitoring
3. Use Chrome DevTools (F12) for debugging
4. Test with multiple browser tabs (admin + participant)
5. Check terminal logs if something goes wrong

---

## 🎨 UI Theme

Purple-Blue gradient theme with clean, modern design powered by Tailwind CSS.

---

## 📞 Need Help?

1. Check the documentation files
2. Review error messages in terminal
3. Check browser console (F12)
4. Verify all setup steps completed
5. Check Supabase dashboard

---

## ✅ You're All Set!

**Ready to start? Follow the Setup Checklist above! 🚀**

Questions? Check the documentation files for detailed guides.

**Enjoy EventNexus! 🎉**

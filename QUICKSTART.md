# EventNexus - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Setup Database (2 minutes)
1. Go to https://supabase.com/dashboard
2. Open your project: https://brnbwnukmnktfrgwiddc.supabase.co
3. Click "SQL Editor" in left sidebar
4. Copy all content from `backend/database/schema.sql`
5. Paste and click "Run"
6. Wait for "Success" message

### Step 2: Start Backend (1 minute)
```bash
cd backend
npm install
npm start
```
✓ Backend running at http://localhost:5000

### Step 3: Start Frontend (1 minute)
```bash
cd frontend
npm install
npm run dev
```
✓ Frontend running at http://localhost:5173

### Step 4: Login & Test (1 minute)
1. Open browser: http://localhost:5173
2. Click "Login"
3. Use admin credentials:
   - Email: `admin@eventnexus.com`
   - Password: `admin123`
4. Create your first event!

## 📋 Quick Commands

### Backend
```bash
cd backend
npm install          # Install dependencies
npm start           # Start server
npm run dev         # Start with auto-reload
```

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev         # Start dev server
npm run build       # Build for production
```

## 🔑 Default Credentials

**Admin Account:**
- Email: admin@eventnexus.com
- Password: admin123

**⚠️ Change this password after first login!**

## 🎯 What to Do First

### As Admin:
1. Login with admin credentials
2. Go to Admin Dashboard
3. Click "Create New Event"
4. Fill in event details
5. Set registration deadline
6. Configure team size (1-1 for individual, 2-5 for teams)
7. Save event

### As Participant:
1. Click "Register" on homepage
2. Create account with your email
3. Browse "Events" page
4. Click on an event
5. Register individually or create/join team
6. Check "Dashboard" for registration status

## 📁 Project Structure
```
eventnexus/
├── backend/          # Node.js + Express API
├── frontend/         # React + Vite app
├── README.md         # Full documentation
├── SETUP_INSTRUCTIONS.md
├── AWS_DEPLOYMENT.md
└── PROJECT_SUMMARY.md
```

## 🔧 Troubleshooting

**Backend won't start?**
- Check if port 5000 is available
- Verify .env file exists in backend/
- Check Supabase credentials

**Frontend won't start?**
- Check if port 5173 is available
- Verify .env file exists in frontend/
- Run `npm install` again

**Can't login?**
- Verify database schema was run
- Check backend is running
- Check browser console for errors

**Database errors?**
- Verify Supabase URL and key in backend/.env
- Check if tables exist in Supabase dashboard
- Ensure RLS policies are enabled

## 📚 Documentation

- **Full Setup:** See `SETUP_INSTRUCTIONS.md`
- **API Docs:** See `API_ROUTES.md`
- **Deployment:** See `AWS_DEPLOYMENT.md`
- **Complete Info:** See `PROJECT_SUMMARY.md`

## ✅ Features Checklist

- ✓ User authentication (JWT)
- ✓ Admin dashboard
- ✓ Event management (CRUD)
- ✓ Individual registration
- ✓ Team registration
- ✓ Invite code system
- ✓ Registration approval
- ✓ Attendance tracking
- ✓ Analytics dashboard
- ✓ Role-based access control

## 🌐 URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## 💡 Tips

1. Use Chrome DevTools to debug frontend issues
2. Check terminal logs for backend errors
3. Use Supabase dashboard to view database
4. Test with multiple browser tabs (admin + participant)
5. Clear browser cache if seeing old data

## 🎨 UI Theme

The app uses a purple-blue gradient theme:
- Primary: Purple (#8b5cf6)
- Secondary: Blue (#3b82f6)
- Clean, modern design with Tailwind CSS

## 📞 Need Help?

1. Check documentation files
2. Review error messages in console
3. Verify all setup steps completed
4. Check Supabase dashboard for data

---

**Ready to go? Start with Step 1 above! 🚀**

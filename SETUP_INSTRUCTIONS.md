# EventNexus Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Git

## Database Setup

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Copy your project URL and anon key

### 2. Run Database Schema
1. Go to Supabase Dashboard > SQL Editor
2. Copy contents from `backend/database/schema.sql`
3. Execute the SQL script

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file
```bash
cp .env.example .env
```

### 4. Configure environment variables
Edit `.env` file:
```
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://brnbwnukmnktfrgwiddc.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key_here
JWT_SECRET=your_secure_random_string_here
FRONTEND_URL=http://localhost:5173
```

### 5. Start backend server
```bash
npm start
# or for development with auto-reload
npm run dev
```

Backend will run on http://localhost:5000

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file
```bash
cp .env.example .env
```

### 4. Configure environment variables
Edit `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

### 5. Start frontend development server
```bash
npm run dev
```

Frontend will run on http://localhost:5173

## Default Admin Account
- Email: admin@eventnexus.com
- Password: admin123

**IMPORTANT:** Change this password immediately in production!

## Testing the Application

1. Open browser to http://localhost:5173
2. Register as a participant or login as admin
3. Admin can create events
4. Participants can browse and register for events

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve the dist folder with a static server
```

## Troubleshooting

### Port already in use
- Change PORT in backend .env
- Change port in frontend vite.config.js

### Database connection issues
- Verify Supabase credentials
- Check if RLS policies are enabled
- Ensure tables are created

### CORS errors
- Verify FRONTEND_URL in backend .env
- Check VITE_API_URL in frontend .env

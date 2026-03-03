# 📚 EventNexus - Complete File Index

## 🎯 Quick Navigation

**Start Here:** `START_HERE.md`

**Quick Setup:** `QUICKSTART.md`

**Full Details:** `COMPLETE_DELIVERY.md`

---

## 📁 PROJECT STRUCTURE

### 🔧 Root Directory Files

| File | Description |
|------|-------------|
| `README.md` | Main project documentation |
| `START_HERE.md` | Getting started guide (READ THIS FIRST) |
| `QUICKSTART.md` | 5-minute setup guide |
| `SETUP_INSTRUCTIONS.md` | Detailed installation instructions |
| `API_ROUTES.md` | Complete API documentation |
| `AWS_DEPLOYMENT.md` | AWS EC2 deployment guide |
| `PROJECT_SUMMARY.md` | Complete feature overview |
| `COMPLETE_DELIVERY.md` | Full project delivery document |
| `VISUAL_OVERVIEW.md` | Architecture diagrams |
| `CHECKLIST.md` | Implementation checklist |
| `FILE_INDEX.md` | This file |
| `install.bat` | Automated installation script |
| `start-backend.bat` | Start backend server |
| `start-frontend.bat` | Start frontend app |

---

### 🔙 Backend Directory (`backend/`)

#### Configuration
- `backend/.env` - Environment variables (configured)
- `backend/.env.example` - Environment template
- `backend/.gitignore` - Git ignore rules
- `backend/package.json` - Dependencies and scripts
- `backend/server.js` - Main server file

#### Database (`backend/database/`)
- `schema.sql` - Complete PostgreSQL schema

#### Source Code (`backend/src/`)

**Config (`backend/src/config/`)**
- `supabase.js` - Supabase client configuration

**Controllers (`backend/src/controllers/`)**
- `authController.js` - Authentication logic (register, login, profile)
- `eventController.js` - Event CRUD operations
- `registrationController.js` - Registration management
- `teamController.js` - Team management
- `analyticsController.js` - Dashboard statistics

**Middleware (`backend/src/middleware/`)**
- `auth.js` - JWT authentication & role authorization

**Models (`backend/src/models/`)**
- `User.js` - User model with bcrypt
- `Event.js` - Event model with statistics
- `Registration.js` - Registration model
- `Team.js` - Team model with invite codes

**Routes (`backend/src/routes/`)**
- `authRoutes.js` - Authentication endpoints
- `eventRoutes.js` - Event endpoints
- `registrationRoutes.js` - Registration endpoints
- `teamRoutes.js` - Team endpoints
- `analyticsRoutes.js` - Analytics endpoints

**Utils (`backend/src/utils/`)**
- `jwt.js` - JWT token generation & verification

---

### 🎨 Frontend Directory (`frontend/`)

#### Configuration
- `frontend/.env` - Environment variables (configured)
- `frontend/.env.example` - Environment template
- `frontend/.gitignore` - Git ignore rules
- `frontend/package.json` - Dependencies and scripts
- `frontend/vite.config.js` - Vite configuration
- `frontend/tailwind.config.js` - Tailwind CSS theme
- `frontend/postcss.config.js` - PostCSS configuration
- `frontend/index.html` - HTML entry point

#### Source Code (`frontend/src/`)

**Main Files**
- `main.jsx` - React entry point
- `App.jsx` - Main app component with routing
- `index.css` - Global styles with Tailwind

**Components (`frontend/src/components/`)**
- `Navbar.jsx` - Navigation bar with auth
- `EventCard.jsx` - Event display card
- `ProtectedRoute.jsx` - Route protection wrapper

**Contexts (`frontend/src/contexts/`)**
- `AuthContext.jsx` - Global authentication state

**Pages (`frontend/src/pages/`)**
- `Home.jsx` - Landing page
- `Login.jsx` - Login form
- `Register.jsx` - Registration form
- `Dashboard.jsx` - User dashboard
- `Events.jsx` - Browse events
- `EventDetail.jsx` - Event details & registration
- `AdminDashboard.jsx` - Admin overview
- `CreateEvent.jsx` - Create event form
- `EditEvent.jsx` - Edit event form
- `ManageEvent.jsx` - Manage registrations

**Services (`frontend/src/services/`)**
- `api.js` - Axios instance with interceptors
- `authService.js` - Authentication API calls
- `eventService.js` - Event API calls
- `registrationService.js` - Registration API calls
- `teamService.js` - Team API calls
- `analyticsService.js` - Analytics API calls

---

## 📊 File Statistics

### By Category

**Backend Files:**
- Configuration: 5 files
- Controllers: 5 files
- Models: 4 files
- Routes: 5 files
- Middleware: 1 file
- Utils: 1 file
- Database: 1 file
- **Total: 22 files**

**Frontend Files:**
- Configuration: 8 files
- Components: 3 files
- Contexts: 1 file
- Pages: 10 files
- Services: 6 files
- **Total: 28 files**

**Documentation:**
- Guides: 10 files
- Scripts: 3 files
- **Total: 13 files**

**Grand Total: 63 files**

---

## 🎯 File Purpose Quick Reference

### Must Read First
1. `START_HERE.md` - Begin here
2. `QUICKSTART.md` - Fast setup
3. `README.md` - Overview

### For Setup
1. `SETUP_INSTRUCTIONS.md` - Detailed setup
2. `install.bat` - Auto install
3. `backend/.env` - Backend config
4. `frontend/.env` - Frontend config

### For Development
1. `API_ROUTES.md` - API reference
2. `backend/src/` - Backend code
3. `frontend/src/` - Frontend code
4. `backend/database/schema.sql` - Database

### For Deployment
1. `AWS_DEPLOYMENT.md` - Deploy guide
2. `COMPLETE_DELIVERY.md` - Full details

### For Reference
1. `PROJECT_SUMMARY.md` - Features
2. `VISUAL_OVERVIEW.md` - Architecture
3. `CHECKLIST.md` - Implementation status
4. `FILE_INDEX.md` - This file

---

## 🔍 Find Files By Purpose

### Authentication
- `backend/src/controllers/authController.js`
- `backend/src/models/User.js`
- `backend/src/routes/authRoutes.js`
- `backend/src/middleware/auth.js`
- `backend/src/utils/jwt.js`
- `frontend/src/services/authService.js`
- `frontend/src/contexts/AuthContext.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Register.jsx`

### Event Management
- `backend/src/controllers/eventController.js`
- `backend/src/models/Event.js`
- `backend/src/routes/eventRoutes.js`
- `frontend/src/services/eventService.js`
- `frontend/src/pages/Events.jsx`
- `frontend/src/pages/EventDetail.jsx`
- `frontend/src/pages/CreateEvent.jsx`
- `frontend/src/pages/EditEvent.jsx`
- `frontend/src/components/EventCard.jsx`

### Registration
- `backend/src/controllers/registrationController.js`
- `backend/src/models/Registration.js`
- `backend/src/routes/registrationRoutes.js`
- `frontend/src/services/registrationService.js`
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/pages/ManageEvent.jsx`

### Team Management
- `backend/src/controllers/teamController.js`
- `backend/src/models/Team.js`
- `backend/src/routes/teamRoutes.js`
- `frontend/src/services/teamService.js`

### Admin Features
- `backend/src/controllers/analyticsController.js`
- `backend/src/routes/analyticsRoutes.js`
- `frontend/src/services/analyticsService.js`
- `frontend/src/pages/AdminDashboard.jsx`
- `frontend/src/pages/ManageEvent.jsx`

### UI Components
- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/EventCard.jsx`
- `frontend/src/components/ProtectedRoute.jsx`
- `frontend/src/index.css`
- `frontend/tailwind.config.js`

### Configuration
- `backend/.env`
- `backend/.env.example`
- `backend/package.json`
- `backend/src/config/supabase.js`
- `frontend/.env`
- `frontend/.env.example`
- `frontend/package.json`
- `frontend/vite.config.js`

### Database
- `backend/database/schema.sql`

---

## 🚀 Quick Access Commands

### View Backend Code
```bash
cd backend/src
```

### View Frontend Code
```bash
cd frontend/src
```

### View Documentation
```bash
# All docs are in root directory
dir *.md
```

### Run Scripts
```bash
# Install everything
install.bat

# Start backend
start-backend.bat

# Start frontend
start-frontend.bat
```

---

## 📝 File Naming Conventions

### Backend
- Controllers: `*Controller.js`
- Models: `*.js` (PascalCase)
- Routes: `*Routes.js`
- Config: `*.js` (camelCase)

### Frontend
- Components: `*.jsx` (PascalCase)
- Pages: `*.jsx` (PascalCase)
- Services: `*Service.js` (camelCase)
- Contexts: `*Context.jsx` (PascalCase)

### Documentation
- Guides: `*.md` (UPPERCASE)
- Scripts: `*.bat` (lowercase)

---

## 🎨 Code Organization

### Backend (MVC Pattern)
```
Models → Controllers → Routes → Server
  ↓         ↓           ↓
Database  Business    API
          Logic     Endpoints
```

### Frontend (Component Pattern)
```
Services → Contexts → Components → Pages
   ↓          ↓          ↓          ↓
  API      State      Reusable   Views
 Calls    Management  UI Parts
```

---

## 📦 Dependencies

### Backend (package.json)
- express
- @supabase/supabase-js
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- uuid

### Frontend (package.json)
- react
- react-dom
- react-router-dom
- axios
- tailwindcss
- vite

---

## 🔗 File Relationships

### Authentication Flow
```
Login.jsx → authService.js → api.js → authRoutes.js → authController.js → User.js → Supabase
```

### Event Creation Flow
```
CreateEvent.jsx → eventService.js → api.js → eventRoutes.js → eventController.js → Event.js → Supabase
```

### Registration Flow
```
EventDetail.jsx → registrationService.js → api.js → registrationRoutes.js → registrationController.js → Registration.js → Supabase
```

---

## ✅ All Files Accounted For

**Total Project Files: 63**

- ✅ Backend: 22 files
- ✅ Frontend: 28 files
- ✅ Documentation: 10 files
- ✅ Scripts: 3 files

**Project Status: 100% Complete**

---

## 🎯 Next Steps

1. Read `START_HERE.md`
2. Run `install.bat`
3. Setup database (see `QUICKSTART.md`)
4. Run `start-backend.bat`
5. Run `start-frontend.bat`
6. Open http://localhost:5173

**You're ready to go! 🚀**

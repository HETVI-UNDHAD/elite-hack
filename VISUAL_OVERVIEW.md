# EventNexus - Visual Project Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                    (React + Vite + Tailwind)                 │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │  Login   │  │ Register │  │Dashboard │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Events  │  │  Event   │  │  Admin   │  │  Manage  │   │
│  │  List    │  │  Detail  │  │Dashboard │  │  Event   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│                    http://localhost:5173                     │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ Axios HTTP Requests
                       │ JWT Token in Headers
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                         BACKEND                              │
│                   (Node.js + Express)                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    API Routes                          │ │
│  │  /api/auth  /api/events  /api/registrations           │ │
│  │  /api/teams  /api/analytics                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Middleware                           │ │
│  │  JWT Authentication  │  Role Authorization            │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Controllers                          │ │
│  │  Auth │ Event │ Registration │ Team │ Analytics       │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                     Models                             │ │
│  │  User │ Event │ Registration │ Team                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│                    http://localhost:5000                     │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ Supabase Client
                       │ SQL Queries
                       │
┌──────────────────────▼───────────────────────────────────────┐
│                       DATABASE                               │
│                  (Supabase PostgreSQL)                       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  users   │  │  events  │  │  teams   │  │registra- │   │
│  │          │  │          │  │          │  │  tions   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│         https://brnbwnukmnktfrgwiddc.supabase.co           │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 User Flow Diagrams

### Participant Registration Flow
```
Start
  │
  ├─> Register Account
  │     │
  │     ├─> Enter Name, Email, Password
  │     │
  │     └─> Account Created ✓
  │
  ├─> Login
  │     │
  │     └─> JWT Token Received ✓
  │
  ├─> Browse Events
  │     │
  │     └─> View Event Details
  │
  ├─> Register for Event
  │     │
  │     ├─> Individual Registration
  │     │     └─> Submit ✓
  │     │
  │     └─> Team Registration
  │           │
  │           ├─> Create New Team
  │           │     ├─> Enter Team Name
  │           │     └─> Get Invite Code ✓
  │           │
  │           └─> Join Existing Team
  │                 ├─> Enter Invite Code
  │                 └─> Join Team ✓
  │
  └─> View Dashboard
        │
        └─> See Registration Status
              (Pending/Approved/Rejected)
```

### Admin Management Flow
```
Start
  │
  ├─> Login as Admin
  │     │
  │     └─> JWT Token with Admin Role ✓
  │
  ├─> Admin Dashboard
  │     │
  │     ├─> View Statistics
  │     │     ├─> Total Events
  │     │     ├─> Total Users
  │     │     ├─> Total Registrations
  │     │     └─> Approved Count
  │     │
  │     └─> View Recent Events
  │
  ├─> Create Event
  │     │
  │     ├─> Enter Event Details
  │     ├─> Set Deadline
  │     ├─> Configure Team Size
  │     └─> Save Event ✓
  │
  ├─> Manage Event
  │     │
  │     ├─> View All Registrations
  │     │
  │     ├─> Approve/Reject
  │     │     └─> Update Status ✓
  │     │
  │     └─> Mark Attendance
  │           └─> Check/Uncheck ✓
  │
  └─> Edit/Delete Event
        └─> Update or Remove ✓
```

## 📊 Database Relationships

```
┌─────────────┐
│    users    │
│─────────────│
│ id (PK)     │◄─────────┐
│ email       │          │
│ password    │          │
│ name        │          │
│ role        │          │
└─────────────┘          │
       │                 │
       │ created_by      │ user_id
       │                 │
       ▼                 │
┌─────────────┐          │
│   events    │          │
│─────────────│          │
│ id (PK)     │◄─────┐   │
│ name        │      │   │
│ description │      │   │
│ date        │      │   │
│ deadline    │      │   │
│ team_size   │      │   │
└─────────────┘      │   │
       │             │   │
       │ event_id    │   │
       │             │   │
       ▼             │   │
┌─────────────┐      │   │
│    teams    │      │   │
│─────────────│      │   │
│ id (PK)     │◄─┐   │   │
│ name        │  │   │   │
│ event_id    │──┘   │   │
│ leader_id   │──────┘   │
│ invite_code │          │
└─────────────┘          │
       │                 │
       │ team_id         │
       │ (optional)      │
       ▼                 │
┌─────────────┐          │
│registrations│          │
│─────────────│          │
│ id (PK)     │          │
│ user_id     │──────────┘
│ event_id    │──────────┐
│ team_id     │          │
│ status      │          │
│ attended    │          │
└─────────────┘          │
                         │
                         └─────┐
                               │
                         ┌─────▼──────┐
                         │  Unique    │
                         │ Constraint │
                         │(user,event)│
                         └────────────┘
```

## 🎨 UI Component Hierarchy

```
App
│
├── AuthProvider (Context)
│   │
│   └── Router
│       │
│       ├── Navbar
│       │   ├── Logo
│       │   ├── Navigation Links
│       │   └── User Menu
│       │
│       └── Routes
│           │
│           ├── Public Routes
│           │   ├── Home
│           │   ├── Login
│           │   └── Register
│           │
│           ├── Protected Routes
│           │   ├── Dashboard
│           │   │   ├── Stats Cards
│           │   │   └── Registration List
│           │   │
│           │   ├── Events
│           │   │   └── EventCard (multiple)
│           │   │
│           │   └── EventDetail
│           │       ├── Event Info
│           │       ├── Stats
│           │       └── Registration Form
│           │
│           └── Admin Routes
│               ├── AdminDashboard
│               │   ├── Analytics Cards
│               │   └── Event List
│               │
│               ├── CreateEvent
│               │   └── Event Form
│               │
│               ├── EditEvent
│               │   └── Event Form
│               │
│               └── ManageEvent
│                   ├── Stats
│                   └── Registration Table
```

## 🔐 Authentication Flow

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │
       │ 1. POST /api/auth/login
       │    { email, password }
       │
       ▼
┌──────────────────┐
│  Auth Controller │
└──────┬───────────┘
       │
       │ 2. Verify credentials
       │    bcrypt.compare()
       │
       ▼
┌──────────────────┐
│   User Model     │
└──────┬───────────┘
       │
       │ 3. Query database
       │
       ▼
┌──────────────────┐
│    Supabase      │
└──────┬───────────┘
       │
       │ 4. Return user data
       │
       ▼
┌──────────────────┐
│  JWT Generator   │
└──────┬───────────┘
       │
       │ 5. Generate token
       │    jwt.sign({ userId, role })
       │
       ▼
┌──────────────────┐
│   Response       │
│  { token, user } │
└──────┬───────────┘
       │
       │ 6. Store in localStorage
       │
       ▼
┌──────────────────┐
│  Future Requests │
│  Authorization:  │
│  Bearer <token>  │
└──────────────────┘
```

## 📦 File Count Summary

```
Backend:
├── Controllers: 5 files
├── Models: 4 files
├── Routes: 5 files
├── Middleware: 1 file
├── Config: 1 file
├── Utils: 1 file
└── Database: 1 SQL file

Frontend:
├── Pages: 10 files
├── Components: 3 files
├── Services: 6 files
├── Contexts: 1 file
└── Config: 5 files

Documentation:
├── README.md
├── QUICKSTART.md
├── SETUP_INSTRUCTIONS.md
├── API_ROUTES.md
├── AWS_DEPLOYMENT.md
├── PROJECT_SUMMARY.md
├── COMPLETE_DELIVERY.md
├── START_HERE.md
└── VISUAL_OVERVIEW.md

Scripts:
├── install.bat
├── start-backend.bat
└── start-frontend.bat

Total: 50+ files
```

## 🚀 Deployment Architecture (AWS EC2)

```
┌─────────────────────────────────────────────────────┐
│                   Internet                          │
└────────────────────┬────────────────────────────────┘
                     │
                     │ HTTPS (443)
                     │ HTTP (80)
                     │
┌────────────────────▼────────────────────────────────┐
│              AWS EC2 Instance                       │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │              Nginx (Reverse Proxy)           │  │
│  │  ┌────────────────┐  ┌────────────────────┐ │  │
│  │  │   Port 80/443  │  │   SSL Certificate  │ │  │
│  │  └────────────────┘  └────────────────────┘ │  │
│  └──────────┬───────────────────┬───────────────┘  │
│             │                   │                   │
│             │                   │                   │
│  ┌──────────▼─────────┐  ┌─────▼──────────────┐   │
│  │   Frontend (5173)  │  │  Backend (5000)    │   │
│  │   React + Vite     │  │  Node.js + Express │   │
│  │   (PM2 Process)    │  │  (PM2 Process)     │   │
│  └────────────────────┘  └────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
                     │
                     │ Supabase Client
                     │
┌────────────────────▼────────────────────────────────┐
│              Supabase Cloud                         │
│         (PostgreSQL Database)                       │
└─────────────────────────────────────────────────────┘
```

## 🎯 Quick Reference

### Ports
- Frontend: 5173
- Backend: 5000
- Nginx: 80, 443

### URLs
- Local Frontend: http://localhost:5173
- Local Backend: http://localhost:5000
- Supabase: https://brnbwnukmnktfrgwiddc.supabase.co

### Default Login
- Email: admin@eventnexus.com
- Password: admin123

### Key Technologies
- Frontend: React 18 + Vite + Tailwind
- Backend: Node.js + Express
- Database: Supabase (PostgreSQL)
- Auth: JWT + bcrypt

---

**This visual overview provides a complete picture of the EventNexus system architecture! 🎨**

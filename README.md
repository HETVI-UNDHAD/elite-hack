# EventNexus - Event Management System

A complete full-stack event management system with team registration, attendance tracking, and admin dashboard.

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Participant)
- Secure password hashing with bcrypt

### Admin Features
- Create, edit, and delete events
- Set registration deadlines
- Configure team size limits
- View and manage registrations
- Approve/reject registrations
- Track attendance
- Analytics dashboard

### Participant Features
- Browse available events
- Register individually or as team
- Create teams with invite codes
- Join teams using invite codes
- View registration status
- Track event attendance

## Tech Stack

### Frontend
- React.js with Vite
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Context API for state management

### Backend
- Node.js with Express.js
- JWT authentication
- RESTful API architecture
- MVC folder structure

### Database
- Supabase (PostgreSQL)
- Row Level Security enabled

## Project Structure

```
eventnexus/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── eventController.js
│   │   │   ├── registrationController.js
│   │   │   ├── teamController.js
│   │   │   └── analyticsController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Event.js
│   │   │   ├── Registration.js
│   │   │   └── Team.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── eventRoutes.js
│   │   │   ├── registrationRoutes.js
│   │   │   ├── teamRoutes.js
│   │   │   └── analyticsRoutes.js
│   │   └── utils/
│   │       └── jwt.js
│   ├── database/
│   │   └── schema.sql
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── EventCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CreateEvent.jsx
│   │   │   ├── EditEvent.jsx
│   │   │   └── ManageEvent.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── eventService.js
│   │   │   ├── registrationService.js
│   │   │   ├── teamService.js
│   │   │   └── analyticsService.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
├── API_ROUTES.md
├── SETUP_INSTRUCTIONS.md
├── AWS_DEPLOYMENT.md
└── README.md
```

## Quick Start

See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed setup guide.

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure .env with your Supabase credentials
npm start
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Default Credentials

**Admin Account:**
- Email: admin@eventnexus.com
- Password: admin123

**Important:** Change the admin password immediately after first login!

## API Documentation

See [API_ROUTES.md](API_ROUTES.md) for complete API documentation.

## Deployment

See [AWS_DEPLOYMENT.md](AWS_DEPLOYMENT.md) for AWS EC2 deployment instructions.

## Database Schema

The application uses 4 main tables:
- **users** - User accounts (admin/participant)
- **events** - Event information
- **teams** - Team details with invite codes
- **registrations** - Event registrations linking users, events, and teams

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=production
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=your_frontend_url
```

### Frontend (.env)
```
VITE_API_URL=your_backend_api_url
```

## License

MIT

## Support

For issues and questions, please create an issue in the repository.

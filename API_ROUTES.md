# EventNexus API Routes

## Base URL
`http://localhost:5000/api`

## Authentication Routes
- `POST /auth/register` - Register new participant
- `POST /auth/login` - Login (admin/participant)
- `GET /auth/profile` - Get current user profile (Protected)

## Event Routes
- `POST /events` - Create event (Admin only)
- `GET /events` - Get all events (Protected)
- `GET /events/:id` - Get event by ID (Protected)
- `PUT /events/:id` - Update event (Admin only)
- `DELETE /events/:id` - Delete event (Admin only)

## Registration Routes
- `POST /registrations` - Register for event (Protected)
- `GET /registrations/my-registrations` - Get user's registrations (Protected)
- `GET /registrations/event/:eventId` - Get event registrations (Admin only)
- `PUT /registrations/:id/status` - Update registration status (Admin only)
- `PUT /registrations/:id/attendance` - Mark attendance (Admin only)

## Team Routes
- `POST /teams` - Create team (Protected)
- `GET /teams/invite/:inviteCode` - Get team by invite code (Protected)
- `GET /teams/:teamId/members` - Get team members (Protected)

## Analytics Routes
- `GET /analytics/dashboard` - Get dashboard statistics (Admin only)

## Authentication
All protected routes require JWT token in Authorization header:
`Authorization: Bearer <token>`

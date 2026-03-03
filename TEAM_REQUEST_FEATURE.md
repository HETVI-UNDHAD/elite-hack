# Team Request Feature Implementation

## Overview
A chat-like panel system where students can post "looking for team members" requests and other students can express interest to join teams.

## Database Schema

### New Tables Created (`add_team_requests.sql`)

1. **team_member_requests**
   - Team leaders post requests when they need members
   - Fields: team_id, event_id, posted_by, members_needed, message, status

2. **join_requests**
   - Participants send join requests to teams
   - Fields: team_request_id, team_id, user_id, status
   - Team leaders approve/reject these requests

## Backend Implementation

### Models
- `TeamRequest.js` - Manages team member requests
- `JoinRequest.js` - Manages join requests from participants

### Controller Methods (teamController.js)
- `postTeamRequest` - Team leader posts a request for members
- `getEventRequests` - Get all open requests for an event
- `sendJoinRequest` - Participant sends join request
- `getTeamJoinRequests` - Team leader views pending join requests
- `handleJoinRequest` - Team leader approves/rejects join requests

### Routes (teamRoutes.js)
- POST `/teams/requests` - Post team request
- GET `/teams/requests/event/:eventId` - Get event requests
- POST `/teams/join-requests` - Send join request
- GET `/teams/:teamId/join-requests` - Get team's join requests
- POST `/teams/join-requests/:id/handle` - Approve/reject join request

## Frontend Implementation

### Components
**TeamRequestPanel.jsx**
- Right-side panel showing all team requests for an event
- Displays "Looking for Members" requests
- Shows pending join requests for team leaders
- Allows participants to express interest ("I want to join")
- Team leaders can approve/reject join requests

### Updated Pages

**EventDetail.jsx**
- Added TeamRequestPanel to the right side
- Team leaders can post "Need Members" requests
- Shows user's current team and role
- Modal for posting team requests with members needed and message

**ManageEvent.jsx (Admin)**
- Added TeamRequestPanel for admins to monitor requests
- Admins can see all team requests for the event

### Services (teamService.js)
- `postTeamRequest(data)` - Post team request
- `getEventRequests(eventId)` - Get event requests
- `sendJoinRequest(teamRequestId)` - Send join request
- `getTeamJoinRequests(teamId)` - Get join requests
- `handleJoinRequest(requestId, action)` - Handle join request

## User Flow

### For Team Leaders (with incomplete teams):
1. Register for event and create team
2. Click "Post Team Request" button on event details page
3. Specify how many members needed and optional message
4. Request appears in the right panel for all participants
5. Receive join requests from interested participants
6. Approve join requests → System sends email invitation
7. Participant receives email and accepts invitation
8. Participant joins the team

### For Participants (looking for teams):
1. Browse event details page
2. View team requests in right panel
3. Click "I want to join" on interesting teams
4. Wait for team leader approval
5. Receive email invitation when approved
6. Click link in email to accept and join team

### For Admins:
1. View ManageEvent page
2. Monitor all team requests in right panel
3. See team formation activity

## Key Features

✅ Auto-approval of registrations (no admin approval needed)
✅ Team member details visible in participant dashboard
✅ Real-time team request panel on event pages
✅ Join request workflow with email invitations
✅ Team leader approval system
✅ Clean, chat-like interface for requests
✅ Available on both participant and admin views

## Setup Instructions

1. Run the SQL migration:
   ```sql
   -- Execute in Supabase SQL Editor
   d:\elite\eventnexus\backend\database\add_team_requests.sql
   ```

2. Backend is ready (models, controllers, routes added)

3. Frontend components are integrated

4. Restart backend server to load new routes

## Notes
- Registrations are now auto-approved (status: 'approved')
- Team invitations still use email flow
- Join requests create a bridge between participants and team leaders
- Panel updates require page refresh (can add real-time later)

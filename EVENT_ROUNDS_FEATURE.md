# Event Rounds/Stages Feature

## Overview
This feature allows admins to define multiple rounds or stages for an event during the event creation process. The rounds are displayed in a visual timeline flow similar to real-world event management applications like Unstop and Devfolio.

## Features

### Admin Features
- **3-Step Event Creation Wizard**:
  - Step 1: Basic event information
  - Step 2: Number of stages/rounds
  - Step 3: Configure each stage with details
- **Define Multiple Rounds**: Support for up to 10 rounds per event
- **Round Details**: Each round includes:
  - Round name (e.g., "Preliminary Round", "Semi-Finals", "Finals")
  - Description
  - Start date & time
  - End date & time (optional)
  - Location
- **Skip Option**: Can skip adding rounds and add them later if needed

### Participant Features
- **Visual Timeline**: See event rounds in a beautiful timeline view
- **Live Status**: Rounds show different states:
  - ✓ Completed (green) - Past rounds
  - ● Live Now (blue, animated) - Currently active rounds
  - ⏱ Upcoming (gray) - Future rounds
- **Round Details**: View all information about each round

## Database Schema

### event_rounds Table
```sql
CREATE TABLE event_rounds (
  id UUID PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  round_number INTEGER NOT NULL,
  round_name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(event_id, round_number)
);
```

## API Endpoints

### POST /api/events/:id/rounds
Add rounds to an event (Admin only)

**Request Body:**
```json
{
  "rounds": [
    {
      "round_name": "Preliminary Round",
      "description": "Initial screening round",
      "start_date": "2024-03-15T09:00:00",
      "end_date": "2024-03-15T12:00:00",
      "location": "Hall A"
    },
    {
      "round_name": "Semi-Finals",
      "description": "Top 10 teams compete",
      "start_date": "2024-03-16T10:00:00",
      "end_date": "2024-03-16T14:00:00",
      "location": "Main Auditorium"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Rounds added successfully",
  "rounds": [...]
}
```

### GET /api/events/:id/rounds
Get all rounds for an event

**Response:**
```json
[
  {
    "id": "uuid",
    "event_id": "uuid",
    "round_number": 1,
    "round_name": "Preliminary Round",
    "description": "Initial screening round",
    "start_date": "2024-03-15T09:00:00",
    "end_date": "2024-03-15T12:00:00",
    "location": "Hall A",
    "created_at": "2024-03-01T10:00:00"
  }
]
```

## Components

### 1. AddEventRounds.jsx
Modal component for adding rounds to an event.

**Props:**
- `eventId` - Event ID
- `eventDate` - Event date for validation
- `onClose` - Close modal callback
- `onSuccess` - Success callback to reload data

**Features:**
- Two-step process:
  1. Ask how many rounds
  2. Fill details for each round
- Form validation
- Date/time pickers
- Responsive design

### 2. EventRoundsFlow.jsx
Visual timeline component to display event rounds.

**Props:**
- `rounds` - Array of round objects
- `eventDate` - Event date

**Features:**
- Timeline visualization with connecting line
- Color-coded status indicators:
  - Green: Completed rounds
  - Blue (animated): Live/active rounds
  - Gray: Upcoming rounds
- Numbered circles for each round
- Responsive layout
- Date formatting

## Usage

### For Admins - Creating Event with Stages

1. Navigate to Admin Dashboard
2. Click "Create Event" button
3. **Step 1 - Event Details:**
   - Fill in event name, description, date, location
   - Set registration deadline
   - Configure team size (min/max)
   - Click "Next: Add Stages →"
4. **Step 2 - Number of Stages:**
   - Enter how many stages/rounds (1-10)
   - Click "Next: Configure Stages →" or "Skip & Finish"
5. **Step 3 - Stage Details:**
   - For each stage, fill in:
     - Stage name (required)
     - Location (optional)
     - Start date & time (required)
     - End date & time (optional)
     - Description (optional)
   - Click "✓ Create Event with Stages"
6. Event is created with all stages configured!

### For Participants

1. Navigate to EventDetail page
2. View the event timeline showing all rounds
3. See which rounds are:
   - Completed (past)
   - Live (currently happening)
   - Upcoming (future)

## Files Modified/Created

### Backend
- `backend/database/add_event_rounds.sql` - Database migration
- `backend/src/models/EventRound.js` - EventRound model
- `backend/src/controllers/eventController.js` - Added round endpoints
- `backend/src/routes/eventRoutes.js` - Added round routes

### Frontend
- `frontend/src/components/EventRoundsFlow.jsx` - Timeline display component
- `frontend/src/pages/CreateEvent.jsx` - **Updated to 3-step wizard**
- `frontend/src/pages/ManageEvent.jsx` - Shows rounds timeline
- `frontend/src/pages/EventDetail.jsx` - Shows rounds to participants

## Setup Instructions

1. **Run Database Migration:**
   ```sql
   -- Execute the SQL in add_event_rounds.sql in your Supabase SQL editor
   ```

2. **Restart Backend Server:**
   ```bash
   cd backend
   npm start
   ```

3. **Frontend is ready** - No additional setup needed

## Example Use Cases

### Hackathon Event
- Round 1: Registration & Team Formation (Day 1, 9 AM - 12 PM)
- Round 2: Ideation Phase (Day 1, 1 PM - 5 PM)
- Round 3: Development Phase (Day 2, 9 AM - 6 PM)
- Round 4: Presentation & Judging (Day 3, 10 AM - 2 PM)
- Round 5: Winner Announcement (Day 3, 3 PM - 4 PM)

### Competition Event
- Round 1: Preliminary Round (Venue A)
- Round 2: Quarter Finals (Venue B)
- Round 3: Semi Finals (Main Hall)
- Round 4: Finals (Auditorium)

### Workshop Event
- Round 1: Introduction Session
- Round 2: Hands-on Workshop
- Round 3: Q&A Session
- Round 4: Certificate Distribution

## Notes

- Rounds are automatically numbered based on their order
- Once rounds are added, the "Add Event Rounds" button is hidden
- Rounds cannot be edited or deleted (future enhancement)
- The timeline automatically determines round status based on current date/time
- All dates are displayed in the user's local timezone
- The visual timeline includes an animated pulse effect for live rounds

# 📧 Email Team Invitation Feature - Setup Guide

## ✅ Feature Implemented!

Team leaders can now invite members via email. Members receive an email with an accept link.

---

## 🔧 Setup Steps

### 1. Add Team Invitations Table to Database

Run this SQL in Supabase SQL Editor:

```sql
-- Team Invitations Table
CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_team_invitations_token ON team_invitations(token);
CREATE INDEX idx_team_invitations_email ON team_invitations(email);

ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on team_invitations" ON team_invitations FOR ALL USING (true);
```

### 2. Restart Backend

```bash
cd backend
npm start
```

The email configuration is already added to `.env`:
- EMAIL_USER=moniii0140@gmail.com
- EMAIL_PASSWORD=mhtd nwnx smek aiqy

---

## 🎯 How It Works

### For Team Leader (Participant):

1. **Register for Event**
   - Go to event detail page
   - Click "Create Team"

2. **Create Team**
   - Enter team name
   - Click "Create Team"
   - Team is created ✅

3. **Invite Members**
   - After team creation, see "Invite Team Members" section
   - Enter member's email address
   - Click "📧 Send Invitation"
   - Email is sent to member ✅

4. **Invite More Members**
   - Keep adding emails
   - Each member gets their own invitation email
   - Click "Done" when finished

### For Team Member (Invited Person):

1. **Receive Email**
   - Gets email with subject: "Team Invitation: [Team Name] - [Event Name]"
   - Email contains team details and "Accept Invitation" button

2. **Click Accept Link**
   - Redirected to platform: `http://localhost:5173/accept-invite/[token]`

3. **Login/Register**
   - If not logged in → Shows login/register options
   - If not registered → Register first
   - If already logged in → Proceeds to step 4

4. **Accept Invitation**
   - Automatically joins the team
   - Registered for the event
   - Redirected to dashboard ✅

---

## 📧 Email Template

Members receive this email:

```
Subject: Team Invitation: [Team Name] - [Event Name]

EventNexus Team Invitation

You've been invited to join the team [Team Name] for the event [Event Name]!

Team: [Team Name]
Event: [Event Name]

[Accept Invitation Button]

Or copy this link: http://localhost:5173/accept-invite/[token]

If you don't have an account, you'll be asked to register first.
```

---

## 🔗 API Endpoints Added

### POST /api/teams/invite
Send team invitation via email
```json
{
  "team_id": "uuid",
  "email": "member@example.com"
}
```

### POST /api/teams/accept/:token
Accept team invitation
- Requires authentication
- Automatically registers user for event
- Adds user to team

---

## ✨ Features

✅ Email invitations with Gmail
✅ Secure token-based invites (7-day expiration)
✅ Auto-register on accept
✅ Login/Register redirect for new users
✅ Multiple member invitations
✅ Invitation status tracking
✅ Team leader verification
✅ Team size validation

---

## 🧪 Testing

### Test Flow:

1. **Create Team:**
   - Login as participant
   - Go to any team event
   - Click "Create Team"
   - Enter team name
   - Click "Create Team"

2. **Invite Member:**
   - Enter email: `test@example.com`
   - Click "Send Invitation"
   - Check email inbox

3. **Accept Invitation:**
   - Open email
   - Click "Accept Invitation"
   - Login/Register if needed
   - Confirm acceptance

4. **Verify:**
   - Check dashboard
   - Both members should see team registration
   - Admin can see both in registrations

---

## 🔐 Security

- Tokens expire after 7 days
- Only team leaders can invite
- Email verification required
- Duplicate registration prevented
- Team size limits enforced

---

## 📝 Notes

- Gmail app password is already configured
- Emails sent from: moniii0140@gmail.com
- Make sure backend is running for emails to send
- Check spam folder if email not received

---

## ✅ Ready to Use!

The feature is fully implemented and ready to test!

Just run the SQL migration and restart the backend.

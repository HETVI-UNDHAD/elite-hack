# Team Request Panel - New Features

## ✅ Features Added

### 1. **Auto-Disable When Team is Full**
- When team leader approves enough members to reach `max_team_size`
- Request automatically changes status to 'closed'
- Shows as grayed out with "✓ Full" badge
- "I want to join" button is disabled
- Message shows: "✓ This team is now full"

### 2. **Search by Team Name**
- Search box at top of panel: "🔎 Search by team name..."
- Real-time filtering as you type
- Case-insensitive search
- Shows "No teams found" if no matches

### 3. **Reply/Comment Feature**
- Every request has a "💬 Reply" button
- Click to open reply text box
- Small textarea for writing replies
- "Send" and "Cancel" buttons
- Replies show in small font below request
- Keeps request visible and clear

## How It Works

### Auto-Disable Flow:
1. Team leader posts request: "Need 3 members"
2. Participant A sends join request → Approved → Email sent
3. Participant B sends join request → Approved → Email sent
4. Participant C sends join request → Approved → Email sent
5. **Team now has 7 members (leader + 3 + 3 existing)**
6. System checks: `memberCount >= max_team_size`
7. **Request automatically closed**
8. Request shows as grayed out with "✓ Full"
9. No more join requests accepted

### Search Flow:
1. User types "innov" in search box
2. Only shows teams with "innov" in name (e.g., "team innovator")
3. Clear search to see all requests again

### Reply Flow:
1. User sees interesting request
2. Clicks "💬 Reply" button
3. Small text box appears
4. Types question: "What skills are you looking for?"
5. Clicks "Send"
6. Reply posted (visible to all)
7. Request remains prominent, reply in small text below

## UI Changes

### Request Card Layout:
```
┌─────────────────────────────────────┐
│ Team Name              [Need 2] or [✓ Full]
│ by Leader Name
│ 
│ Request message here...
│ 
│ 💬 Reply
│ 
│ [Reply box if open]
│ 
│ [🙋 I want to join] (if not full)
│ or
│ ✓ This team is now full (if full)
└─────────────────────────────────────┘
```

### Colors:
- **Open requests**: White background, orange badge
- **Closed requests**: Gray background, gray badge, 60% opacity
- **Reply button**: Blue text, small font
- **Reply box**: White with border, small textarea

## Backend Changes

### teamController.js
- `handleJoinRequest()` now checks team size after approval
- Automatically closes request when team reaches max size
- Uses `TeamRequest.updateStatus(id, 'closed')`

### TeamRequest.js
- `findByEvent()` now returns ALL requests (open and closed)
- Allows users to see which teams are full

## Testing

1. **Test Auto-Disable:**
   - Create team with max_team_size = 5
   - Post request for 2 members
   - Approve 2 join requests
   - Request should auto-close

2. **Test Search:**
   - Type team name in search box
   - Verify filtering works
   - Clear search to see all

3. **Test Reply:**
   - Click "Reply" on any request
   - Type message and send
   - Verify reply appears

## Notes

- Replies are currently frontend-only (can add backend storage later)
- Closed requests still visible so users know which teams are full
- Search is case-insensitive for better UX
- Reply feature helps participants ask questions before joining

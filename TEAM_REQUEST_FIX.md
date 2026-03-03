# Team Request Panel Fix - Team Size Limit Issue

## Problem Description

When a team leader approved 3 join requests (for a team with max size 3), the team request would still show as "open" in the request panel instead of being marked as "closed/full". Additionally, users could still click "🙋 I want to join" button and send requests even after the team was full.

## Root Cause

Two issues were identified:

1. **Backend counting issue**: The system was only counting **actual team members** (users who have accepted invitations and have registrations) when checking if a team is full. It was NOT counting **pending invitations** that were sent but not yet accepted.

2. **Missing validation**: The `sendJoinRequest` endpoint didn't validate if the team request was closed or if the team was full before allowing users to send join requests.

### Flow Before Fix:
1. Team leader approves 3 join requests
2. System sends 3 invitations (status: pending)
3. System checks member count → Returns 0 (no one accepted yet)
4. Team request stays "open" ❌
5. Other users can still send join requests ❌
6. Backend rejects with 400 error but button stays enabled ❌

## Solution

Modified the system to:
1. Count both actual members AND pending invitations ("total committed count")
2. Validate team status before accepting join requests
3. Auto-close requests when team becomes full
4. Better error handling and UI refresh

### Flow After Fix:
1. Team leader approves 3 join requests
2. System sends 3 invitations (status: pending)
3. System checks total committed count → Returns 3 (0 members + 3 pending)
4. Team request is marked as "closed" ✅
5. Other users see grayed out card with "✓ Full" badge ✅
6. If they somehow try to join, backend validates and returns clear error ✅
7. Frontend refreshes to show updated status ✅

## Changes Made

### 1. Team Model (`backend/src/models/Team.js`)
Added three new methods:
- `getPendingInvitationsCount(teamId)` - Counts pending invitations
- `getTotalCommittedCount(teamId)` - Returns members + pending invitations
- Kept existing `getMemberCount(teamId)` for backward compatibility

### 2. Team Controller (`backend/src/controllers/teamController.js`)

#### Updated `sendJoinRequest`:
- Check if team request status is 'closed' before allowing join
- Check total committed count and validate team isn't full
- Auto-close request if team became full
- Return clear error message: "This team is already full"

#### Updated `handleJoinRequest`:
- Check total committed count BEFORE approving (prevent over-inviting)
- Check total committed count AFTER approving to close request if full
- Better error message when team is full

#### Updated `inviteTeamMember`:
- Use total committed count instead of just member count
- Prevents team leader from manually inviting when spots are reserved

### 3. TeamRequestPanel Component (`frontend/src/components/TeamRequestPanel.jsx`)

#### Updated `handleJoinRequest`:
- Added await to loadRequests() for proper refresh
- Reload requests even on error to get updated status
- Better error message display

#### Updated `handleApproveReject`:
- Added await to both reload calls
- Improved error message handling

## Testing Checklist

- [x] Team with max size 3, leader approves 3 requests → Request closes
- [x] Team with max size 3, leader approves 2 requests → Request stays open
- [x] User cannot send join request to closed team
- [x] User gets clear error message if team is full
- [x] Frontend refreshes and shows "✓ Full" badge
- [x] Team leader cannot approve more requests when team is full
- [x] Team leader cannot manually invite when all spots are taken/reserved
- [x] Request panel shows grayed out card for closed requests

## Additional Notes

- Pending invitations expire after 7 days (configured in TeamInvitation model)
- If an invitation expires or is declined, the spot becomes available again
- The frontend correctly displays closed requests with gray background and "✓ Full" badge
- Backend validates on every join request attempt to prevent race conditions

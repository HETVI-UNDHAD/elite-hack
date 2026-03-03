const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, teamController.createTeam);
router.post('/invite', authenticate, teamController.inviteTeamMember);
router.post('/accept/:token', authenticate, teamController.acceptInvitation);
router.get('/invite/:inviteCode', authenticate, teamController.getTeamByInviteCode);
router.get('/:teamId/members', authenticate, teamController.getTeamMembers);

// Team member requests
router.post('/requests', authenticate, teamController.postTeamRequest);
router.get('/requests/event/:eventId', authenticate, teamController.getEventRequests);

// Join requests
router.post('/join-requests', authenticate, teamController.sendJoinRequest);
router.get('/:teamId/join-requests', authenticate, teamController.getTeamJoinRequests);
router.post('/join-requests/:id/handle', authenticate, teamController.handleJoinRequest);

// Replies
router.post('/requests/reply', authenticate, teamController.postReply);

module.exports = router;

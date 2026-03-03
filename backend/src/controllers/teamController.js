const Team = require('../models/Team');
const Event = require('../models/Event');
const TeamInvitation = require('../models/TeamInvitation');
const Registration = require('../models/Registration');
const TeamRequest = require('../models/TeamRequest');
const JoinRequest = require('../models/JoinRequest');
const RequestReply = require('../models/RequestReply');
const { sendTeamInvitation } = require('../utils/emailService');

exports.createTeam = async (req, res) => {
  try {
    const { name, event_id } = req.body;

    if (!name || !event_id) {
      return res.status(400).json({ error: 'Team name and event ID are required' });
    }

    const event = await Event.findById(event_id);
    if (event.min_team_size === 1 && event.max_team_size === 1) {
      return res.status(400).json({ error: 'This event does not allow teams' });
    }

    const team = await Team.create({
      name,
      event_id,
      leader_id: req.user.userId
    });

    res.status(201).json({ message: 'Team created successfully', team });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.inviteTeamMember = async (req, res) => {
  try {
    const { team_id, email } = req.body;

    if (!team_id || !email) {
      return res.status(400).json({ error: 'Team ID and email are required' });
    }

    const team = await Team.findById(team_id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    if (team.leader_id !== req.user.userId) {
      return res.status(403).json({ error: 'Only team leader can invite members' });
    }

    const event = await Event.findById(team.event_id);
    
    // Check if user with this email is already registered for this event
    const { data: existingUser } = await require('../config/supabase')
      .from('users')
      .select('id')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      const existingReg = await Registration.findByUserAndEvent(existingUser.id, team.event_id);
      if (existingReg) {
        const existingTeam = await Team.findById(existingReg.team_id);
        return res.status(400).json({ 
          error: `This user is already registered in team "${existingTeam.name}" for this event` 
        });
      }
    }
    
    // Check if there's already a pending invitation for this email in this event
    const { data: existingInvites } = await require('../config/supabase')
      .from('team_invitations')
      .select(`
        *,
        teams!inner(event_id, name)
      `)
      .eq('email', email)
      .eq('teams.event_id', team.event_id)
      .eq('status', 'pending');
    
    if (existingInvites && existingInvites.length > 0) {
      const otherTeam = existingInvites[0].teams;
      return res.status(400).json({ 
        error: `This user already has a pending invitation from team "${otherTeam.name}" for this event` 
      });
    }
    
    const totalCommitted = await Team.getTotalCommittedCount(team_id);
    
    if (totalCommitted >= event.max_team_size) {
      return res.status(400).json({ error: 'Team is full (including pending invitations)' });
    }

    const invitation = await TeamInvitation.create({
      team_id,
      email,
      invited_by: req.user.userId
    });

    await sendTeamInvitation(email, team.name, invitation.token, event.name);

    res.status(201).json({ 
      message: 'Invitation sent successfully',
      invitation: { email, status: 'pending' }
    });
  } catch (error) {
    console.error('Invite error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.acceptInvitation = async (req, res) => {
  try {
    const { token } = req.params;

    const invitation = await TeamInvitation.findByToken(token);
    
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ error: 'Invitation already processed' });
    }

    if (new Date() > new Date(invitation.expires_at)) {
      return res.status(400).json({ error: 'Invitation expired' });
    }

    const existingReg = await Registration.findByUserAndEvent(
      req.user.userId,
      invitation.teams.event_id
    );

    if (existingReg) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    await Registration.create({
      user_id: req.user.userId,
      event_id: invitation.teams.event_id,
      team_id: invitation.team_id,
      status: 'approved'
    });

    await TeamInvitation.updateStatus(invitation.id, 'accepted');

    res.json({ 
      message: 'Invitation accepted successfully',
      team: {
        id: invitation.teams.id,
        name: invitation.teams.name,
        invite_code: invitation.teams.invite_code
      },
      event: {
        id: invitation.teams.events.id,
        name: invitation.teams.events.name
      }
    });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTeamByInviteCode = async (req, res) => {
  try {
    const team = await Team.findByInviteCode(req.params.inviteCode);
    
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const members = await Team.getMembers(team.id);
    const event = await Event.findById(team.event_id);

    res.json({
      ...team,
      members,
      memberCount: members.length,
      maxSize: event.max_team_size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeamMembers = async (req, res) => {
  try {
    const members = await Team.getMembers(req.params.teamId);
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postTeamRequest = async (req, res) => {
  try {
    const { team_id, members_needed, message } = req.body;

    const team = await Team.findById(team_id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    if (team.leader_id !== req.user.userId) {
      return res.status(403).json({ error: 'Only team leader can post requests' });
    }

    const request = await TeamRequest.create({
      team_id,
      event_id: team.event_id,
      posted_by: req.user.userId,
      members_needed,
      message,
      status: 'open'
    });

    res.status(201).json({ message: 'Request posted successfully', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventRequests = async (req, res) => {
  try {
    const requests = await TeamRequest.findByEvent(req.params.eventId);
    
    // Get replies for each request
    for (let request of requests) {
      const replies = await RequestReply.findByRequest(request.id);
      request.replies = replies;
    }
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.postReply = async (req, res) => {
  try {
    const { request_id, message } = req.body;

    const reply = await RequestReply.create({
      request_id,
      user_id: req.user.userId,
      message
    });

    res.status(201).json({ message: 'Reply posted', reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendJoinRequest = async (req, res) => {
  try {
    const { team_request_id } = req.body;

    const teamRequest = await TeamRequest.findById(team_request_id);
    if (!teamRequest) {
      return res.status(404).json({ error: 'Team request not found' });
    }

    if (teamRequest.status === 'closed') {
      return res.status(400).json({ error: 'This team is already full' });
    }

    const team = await Team.findById(teamRequest.team_id);
    const event = await Event.findById(team.event_id);
    const totalCommitted = await Team.getTotalCommittedCount(teamRequest.team_id);
    
    if (totalCommitted >= event.max_team_size) {
      await TeamRequest.updateStatus(team_request_id, 'closed');
      return res.status(400).json({ error: 'This team is already full' });
    }

    const joinRequest = await JoinRequest.create({
      team_request_id,
      team_id: teamRequest.team_id,
      user_id: req.user.userId,
      status: 'pending'
    });

    res.status(201).json({ message: 'Join request sent successfully', joinRequest });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'You already sent a request to this team' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getTeamJoinRequests = async (req, res) => {
  try {
    const requests = await JoinRequest.findByTeam(req.params.teamId);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.handleJoinRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const joinRequest = await JoinRequest.findById(id);
    if (!joinRequest) {
      return res.status(404).json({ error: 'Join request not found' });
    }

    const team = await Team.findById(joinRequest.team_id);
    if (team.leader_id !== req.user.userId) {
      return res.status(403).json({ error: 'Only team leader can handle requests' });
    }

    if (action === 'approve') {
      const event = await Event.findById(team.event_id);
      const totalCommitted = await Team.getTotalCommittedCount(joinRequest.team_id);
      
      if (totalCommitted >= event.max_team_size) {
        return res.status(400).json({ error: 'Team is already full (including pending invitations)' });
      }

      const { data: user } = await require('../config/supabase')
        .from('users')
        .select('email')
        .eq('id', joinRequest.user_id)
        .single();

      const invitation = await TeamInvitation.create({
        team_id: joinRequest.team_id,
        email: user.email,
        invited_by: req.user.userId
      });

      const teamRequest = await TeamRequest.findById(joinRequest.team_request_id);
      
      await sendTeamInvitation(user.email, team.name, invitation.token, event.name);
      await JoinRequest.updateStatus(id, 'approved');

      // Check if team is now full (including pending invitations)
      const newTotalCommitted = await Team.getTotalCommittedCount(joinRequest.team_id);
      
      if (newTotalCommitted >= event.max_team_size) {
        await TeamRequest.updateStatus(joinRequest.team_request_id, 'closed');
      }

      res.json({ message: 'Invitation sent to user' });
    } else {
      await JoinRequest.updateStatus(id, 'rejected');
      res.json({ message: 'Request rejected' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

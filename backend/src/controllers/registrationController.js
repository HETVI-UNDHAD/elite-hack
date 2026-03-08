const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Team = require('../models/Team');

exports.registerForEvent = async (req, res) => {
  try {
    const { event_id, team_id } = req.body;
    const user_id = req.user.userId;

    if (!event_id) {
      return res.status(400).json({ error: 'Event ID is required' });
    }

    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const deadline = new Date(event.registration_deadline);
    
    if (new Date() > deadline) {
      return res.status(400).json({ error: 'Registration deadline has passed' });
    }

    const existingRegistration = await Registration.findByUserAndEvent(user_id, event_id);
    if (existingRegistration) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }

    if (team_id) {
      const memberCount = await Team.getMemberCount(team_id);
      const maxSize = event.max_team_size || 10;
      if (memberCount >= maxSize) {
        return res.status(400).json({ error: 'Team is full' });
      }
    }

    // Set status as 'pending' if team doesn't meet minimum size, otherwise 'approved'
    let status = 'approved';
    if (team_id && event.min_team_size) {
      const memberCount = await Team.getMemberCount(team_id);
      if (memberCount + 1 < event.min_team_size) {
        status = 'pending';
      }
    }

    const registration = await Registration.create({
      user_id,
      event_id,
      team_id: team_id || null,
      status
    });

    res.status(201).json({ message: 'Registration successful', registration });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.findByUser(req.user.userId);
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.findByEvent(req.params.eventId);
    const event = await Event.findById(req.params.eventId);
    
    // Filter out incomplete teams
    const validRegistrations = registrations.filter(reg => {
      if (!reg.team_id) return true; // Individual registrations are always valid
      if (!event.min_team_size) return true; // If no min size set, all teams are valid
      
      // Count team members
      const teamMembers = registrations.filter(r => r.team_id === reg.team_id);
      return teamMembers.length >= event.min_team_size;
    });
    
    res.json(validRegistrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const registration = await Registration.updateStatus(req.params.id, status);
    res.json({ message: 'Registration status updated', registration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { attended } = req.body;
    const registration = await Registration.markAttendance(req.params.id, attended);
    res.json({ message: 'Attendance marked', registration });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

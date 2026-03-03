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
      if (memberCount >= event.max_team_size) {
        return res.status(400).json({ error: 'Team is full' });
      }
    }

    const registration = await Registration.create({
      user_id,
      event_id,
      team_id: team_id || null,
      status: 'approved'
    });

    res.status(201).json({ message: 'Registration successful', registration });
  } catch (error) {
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
    res.json(registrations);
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

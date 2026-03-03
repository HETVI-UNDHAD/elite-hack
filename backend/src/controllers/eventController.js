const Event = require('../models/Event');
const EventRound = require('../models/EventRound');

exports.createEvent = async (req, res) => {
  try {
    const { name, description, date, location, registration_deadline, min_team_size, max_team_size } = req.body;

    if (!name || !date || !registration_deadline) {
      return res.status(400).json({ error: 'Name, date, and registration deadline are required' });
    }

    const event = await Event.create({
      name,
      description,
      date,
      location,
      registration_deadline,
      min_team_size: min_team_size || 1,
      max_team_size: max_team_size || 1,
      created_by: req.user.userId
    });

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.getWithStats(req.params.id);
    try {
      const rounds = await EventRound.findByEvent(req.params.id);
      res.json({ ...event, rounds });
    } catch (roundError) {
      // If rounds table doesn't exist yet, return event without rounds
      res.json({ ...event, rounds: [] });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { name, description, date, location, registration_deadline, min_team_size, max_team_size } = req.body;
    
    const event = await Event.update(req.params.id, {
      name,
      description,
      date,
      location,
      registration_deadline,
      min_team_size,
      max_team_size
    });

    res.json({ message: 'Event updated successfully', event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.delete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addEventRounds = async (req, res) => {
  try {
    const { rounds } = req.body;
    const eventId = req.params.id;

    if (!rounds || !Array.isArray(rounds) || rounds.length === 0) {
      return res.status(400).json({ error: 'Rounds array is required' });
    }

    const roundsData = rounds.map((round, index) => ({
      event_id: eventId,
      round_number: index + 1,
      round_name: round.round_name,
      description: round.description,
      start_date: round.start_date,
      end_date: round.end_date,
      location: round.location
    }));

    const createdRounds = await EventRound.bulkCreate(roundsData);
    res.status(201).json({ message: 'Rounds added successfully', rounds: createdRounds });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventRounds = async (req, res) => {
  try {
    const rounds = await EventRound.findByEvent(req.params.id);
    res.json(rounds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

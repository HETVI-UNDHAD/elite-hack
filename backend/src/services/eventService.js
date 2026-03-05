const eventRepository = require('../repositories/eventRepository');

class EventService {
  async createEvent(eventData, userId) {
    if (!eventData.name || !eventData.date || !eventData.registration_deadline) {
      throw new Error('Name, date, and registration deadline are required');
    }

    const event = await eventRepository.create({
      ...eventData,
      min_team_size: eventData.min_team_size || 1,
      max_team_size: eventData.max_team_size || 1,
      fee: eventData.fee || 0,
      created_by: userId
    });

    return event;
  }

  async getAllEvents() {
    const events = await eventRepository.findAll();
    return events.map(event => ({
      ...event,
      stats: {
        totalRegistrations: event.registrations?.[0]?.count || 0
      },
      registrations: undefined
    }));
  }

  async getEventById(id) {
    const event = await eventRepository.findById(id);
    const stats = await eventRepository.getStats(id);
    
    return {
      ...event,
      stats: {
        totalRegistrations: stats.length,
        approved: stats.filter(r => r.status === 'approved').length,
        pending: stats.filter(r => r.status === 'pending').length,
        rejected: stats.filter(r => r.status === 'rejected').length
      }
    };
  }

  async updateEvent(id, eventData) {
    return await eventRepository.update(id, eventData);
  }

  async deleteEvent(id) {
    await eventRepository.delete(id);
  }
}

module.exports = new EventService();

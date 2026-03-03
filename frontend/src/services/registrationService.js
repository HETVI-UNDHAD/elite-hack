import api from './api';

export const registrationService = {
  registerForEvent: async (data) => {
    const response = await api.post('/registrations', data);
    return response.data;
  },

  getMyRegistrations: async () => {
    const response = await api.get('/registrations/my-registrations');
    return response.data;
  },

  getEventRegistrations: async (eventId) => {
    const response = await api.get(`/registrations/event/${eventId}`);
    return response.data;
  },

  updateRegistrationStatus: async (id, status) => {
    const response = await api.put(`/registrations/${id}/status`, { status });
    return response.data;
  },

  markAttendance: async (id, attended) => {
    const response = await api.put(`/registrations/${id}/attendance`, { attended });
    return response.data;
  },
};

import api from './api';

export const teamService = {
  createTeam: async (data) => {
    const response = await api.post('/teams', data);
    return response.data;
  },

  inviteTeamMember: async (teamId, email) => {
    const response = await api.post('/teams/invite', { team_id: teamId, email });
    return response.data;
  },

  acceptInvitation: async (token) => {
    const response = await api.post(`/teams/accept/${token}`);
    return response.data;
  },

  getTeamByInviteCode: async (inviteCode) => {
    const response = await api.get(`/teams/invite/${inviteCode}`);
    return response.data;
  },

  getTeamMembers: async (teamId) => {
    const response = await api.get(`/teams/${teamId}/members`);
    return response.data;
  },

  postTeamRequest: async (data) => {
    const response = await api.post('/teams/requests', data);
    return response.data;
  },

  getEventRequests: async (eventId) => {
    const response = await api.get(`/teams/requests/event/${eventId}`);
    return response.data;
  },

  sendJoinRequest: async (teamRequestId) => {
    const response = await api.post('/teams/join-requests', { team_request_id: teamRequestId });
    return response.data;
  },

  getTeamJoinRequests: async (teamId) => {
    const response = await api.get(`/teams/${teamId}/join-requests`);
    return response.data;
  },

  handleJoinRequest: async (requestId, action) => {
    const response = await api.post(`/teams/join-requests/${requestId}/handle`, { action });
    return response.data;
  },

  postReply: async (requestId, message) => {
    const response = await api.post('/teams/requests/reply', { request_id: requestId, message });
    return response.data;
  },
};

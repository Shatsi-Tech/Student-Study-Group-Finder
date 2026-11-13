import api from './api';

export const sessionService = {
  async createSession(sessionData) {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  },

  async getMyUpcomingSessions() {
    const response = await api.get('/sessions/my-upcoming');
    return response.data;
  },

  async getGroupSessions(groupId) {
    const response = await api.get(`/sessions/group/${groupId}`);
    return response.data;
  },

  async updateSessionStatus(sessionId, status) {
    const response = await api.put(`/sessions/${sessionId}/status`, { status });
    return response.data;
  }
};

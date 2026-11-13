import api from './api';

export const groupService = {
  async getGroups(params = {}) {
    const response = await api.get('/groups', { params });
    return response.data;
  },

  async getGroupById(id) {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },

  async createGroup(groupData) {
    const response = await api.post('/groups', groupData);
    return response.data;
  },

  async updateGroup(id, groupData) {
    const response = await api.put(`/groups/${id}`, groupData);
    return response.data;
  },

  async deleteGroup(id) {
    const response = await api.delete(`/groups/${id}`);
    return response.data;
  },

  async joinGroup(id) {
    const response = await api.post(`/groups/${id}/join`);
    return response.data;
  },

  async leaveGroup(id) {
    const response = await api.post(`/groups/${id}/leave`);
    return response.data;
  },

  async removeMember(groupId, userId) {
    const response = await api.delete(`/groups/${groupId}/members/${userId}`);
    return response.data;
  }
};

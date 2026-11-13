import api from './api';

export const adminService = {
  async getStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getAllUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async toggleUserStatus(userId) {
    const response = await api.put(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  async deleteUser(userId) {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  async getAllGroups() {
    const response = await api.get('/admin/groups');
    return response.data;
  }
};

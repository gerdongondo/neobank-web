// src/api/admin.js
import client from './client';

export const adminApi = {
  getStats: async () => {
    const response = await client.get('/admin/stats');
    return response.data;
  },

  getUsers: async (page = 0, size = 10) => {
    const response = await client.get('/admin/users', {
      params: { page, size },
    });
    return response.data;
  },

  getTransactions: async (page = 0, size = 10) => {
    const response = await client.get('/admin/transactions', {
      params: { page, size },
    });
    return response.data;
  },

  blockUser: async (userId) => {
    const response = await client.put(`/admin/users/${userId}/block`);
    return response.data;
  },

  unblockUser: async (userId) => {
    const response = await client.put(`/admin/users/${userId}/unblock`);
    return response.data;
  },
};
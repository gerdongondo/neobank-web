// src/api/transfer.js
import client from './client';

export const transferApi = {
  transfer: async (data) => {
    const response = await client.post('/transfer', data);
    return response.data;
  },

  getHistory: async (page = 0, size = 10) => {
    const response = await client.get('/transfer/history', {
      params: { page, size },
    });
    return response.data;
  },
};
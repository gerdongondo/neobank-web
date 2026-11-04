// src/api/account.js
import client from './client';

export const accountApi = {
  getAccount: async () => {
    const response = await client.get('/account/me');
    return response.data;
  },

  getBalance: async () => {
    const response = await client.get('/account/balance');
    return response.data;
  },
};
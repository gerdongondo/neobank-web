// src/api/auth.js
import client from './client';

export const authApi = {
  login: async (email, password) => {
    const response = await client.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (data) => {
    const response = await client.post('/auth/register', data);
    return response.data;
  },
};
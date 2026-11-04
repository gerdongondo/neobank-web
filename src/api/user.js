// src/api/user.js
import client from './client';

export const userApi = {
  getProfile: async () => {
    const response = await client.get('/user/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await client.put('/user/profile', data);
    return response.data;
  },

  updatePassword: async (data) => {
    const response = await client.put('/user/password', data);
    return response.data;
  },
};
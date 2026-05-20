import { apiClient } from './apiClient';

export const authService = {
  // 1. Standard Login
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  // 2. Standard User Registration (The "Front Door")
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // 3. The Magic Link Registration (For Agents)
  registerAgent: async (agentData) => {
    const response = await apiClient.post('/auth/register-agent', agentData);
    return response.data;
  }
};
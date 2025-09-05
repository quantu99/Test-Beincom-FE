import { apiClient } from './client';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '@/types/auth';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post('/auth/login', data);
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post('/auth/register', data);
  },

  getProfile: async (): Promise<User> => {
    return apiClient.get('/auth/me');
  },
};

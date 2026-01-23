import apiClient, { getApiErrorMessage } from './client';
import type { User, AuthResponse } from '@/features/auth/types/auth.types';

// API response types (matching backend DTOs)
interface ApiTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    householdId?: string;
    householdName?: string;
  };
}

// Transform API response to frontend format
function transformAuthResponse(apiResponse: ApiTokenResponse): AuthResponse {
  return {
    user: {
      id: apiResponse.user.id,
      email: apiResponse.user.email,
      role: apiResponse.user.role as User['role'],
      firstName: apiResponse.user.firstName,
      lastName: apiResponse.user.lastName,
      avatar: apiResponse.user.avatar,
      householdId: apiResponse.user.householdId,
      createdAt: new Date().toISOString(),
    },
    token: apiResponse.accessToken,
    refreshToken: apiResponse.refreshToken,
  };
}

export const authApi = {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiTokenResponse>('/auth/login', {
        email,
        password,
      });
      return transformAuthResponse(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Register a new user and create household
   */
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    householdName?: string;
  }): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiTokenResponse>('/auth/register', {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        householdName: data.householdName || `${data.firstName}'s Household`,
        role: 'ADMIN', // First user is always admin
      });
      return transformAuthResponse(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiTokenResponse>('/auth/refresh', {
        refreshToken,
      });
      return transformAuthResponse(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Logout - invalidate token on server
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore logout errors - we'll clear local state anyway
    }
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/users/me');
      return response.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
};

export default authApi;

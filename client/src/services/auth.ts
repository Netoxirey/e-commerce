import { apiService } from './api';
import { AuthResponse, LoginRequest, SignupRequest } from '@/types';

export const authService = {
  // Sign up
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/signup', data);

    // Set access token after successful signup (refresh token is set by server via cookie)
    if (response.success && response.data.accessToken) {
      apiService.setAuthToken(response.data.accessToken);
    }

    return response.data;
  },

  // Sign in
  async signin(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/auth/signin', data);

    // Set access token after successful signin (refresh token is set by server via cookie)
    if (response.success && response.data.accessToken) {
      apiService.setAuthToken(response.data.accessToken);
    }

    return response.data;
  },

  // Refresh token (refresh token is sent via cookie)
  async refreshToken(): Promise<{ accessToken: string }> {
    const response = await apiService.post<{ accessToken: string }>(
      '/auth/refresh'
    );
    return response.data;
  },

  // Logout
  async logout(): Promise<{ message: string }> {
    const response = await apiService.post<{ message: string }>('/auth/logout');

    // Clear tokens after logout
    apiService.clearAuth();

    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return apiService.isAuthenticated();
  },

  // Get stored access token
  getStoredAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  },

  // Restore authentication state from stored access token and cookie
  async restoreAuthState(): Promise<{ isAuthenticated: boolean; user?: any }> {
    const accessToken = this.getStoredAccessToken();

    if (!accessToken) {
      // No access token, try to refresh using cookie (user might have refresh token only)
      try {
        const refreshResponse = await this.refreshToken();
        apiService.setAuthToken(refreshResponse.accessToken);

        // Try to fetch user profile with new token
        const response = await apiService.get('/users/profile');
        return {
          isAuthenticated: true,
          user: response.data,
        };
      } catch {
        // No valid tokens available
        return { isAuthenticated: false };
      }
    }

    try {
      // Set access token in API service
      apiService.setAuthToken(accessToken);

      // Try to fetch user profile to validate token
      // Note: If token is expired, the API interceptor will automatically
      // try to refresh using the cookie and retry the request
      const response = await apiService.get('/users/profile');
      return {
        isAuthenticated: true,
        user: response.data,
      };
    } catch {
      // Token refresh failed (handled by interceptor), clear auth state
      this.clearAuth();
      return { isAuthenticated: false };
    }
  },

  // Clear authentication
  clearAuth(): void {
    apiService.clearAuth();
  },
};

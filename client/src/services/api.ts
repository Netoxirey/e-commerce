import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '@/types';

class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  constructor() {
    this.api = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
      timeout: 10000,
      withCredentials: true, // Enable cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private processQueue(error: unknown, token: string | null = null) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Skip refresh logic for auth endpoints to prevent infinite loop
        const isAuthEndpoint =
          originalRequest?.url?.includes('/auth/refresh') ||
          originalRequest?.url?.includes('/auth/logout');

        // Handle 401 errors (token expired) - but not for auth endpoints
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !isAuthEndpoint
        ) {
          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.api(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Try to refresh token using cookie
            const response = await this.refreshAccessToken();
            const newAccessToken = response.data.accessToken;
            this.setAccessToken(newAccessToken);

            // Process queued requests with new token
            this.processQueue(null, newAccessToken);

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            // Refresh failed, reject all queued requests
            this.processQueue(refreshError, null);

            // Clear auth - callers should handle redirect/navigation
            this.clearAuth();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
        const apiError: ApiError = {
          statusCode: error.response?.status || 500,
          message: error.response?.data?.message || 'An error occurred',
          error: error.response?.data?.error || 'Internal Server Error',
          timestamp:
            error.response?.data?.timestamp || new Date().toISOString(),
          path: error.response?.data?.path || error.config?.url || '',
          method: error.config?.method?.toUpperCase() || 'UNKNOWN',
        };

        return Promise.reject(apiError);
      }
    );
  }

  // Token management (only access token in localStorage, refresh token in httpOnly cookie)
  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  private setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  private clearAccessToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  }

  // Auth methods
  async refreshAccessToken(): Promise<AxiosResponse<{ accessToken: string }>> {
    // Refresh token is automatically sent via cookie
    return this.api.post('/auth/refresh');
  }

  // Generic HTTP methods
  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.api.get(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.api.put(url, data, config);
    return response.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.api.patch(url, data, config);
    return response.data;
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.api.delete(url, config);
    return response.data;
  }

  // Set access token after successful login (refresh token is set by server via cookie)
  setAuthToken(accessToken: string): void {
    this.setAccessToken(accessToken);
  }

  // Clear auth on logout
  clearAuth(): void {
    this.clearAccessToken();
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const apiService = new ApiService();
export default apiService;

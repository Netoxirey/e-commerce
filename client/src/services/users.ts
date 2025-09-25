import { apiService } from './api';
import { User, UserProfile, Address, UpdateUserRequest, UpdateUserProfileRequest, CreateAddressRequest, UpdateAddressRequest, PaginatedResponse } from '@/types';

export const usersService = {
  // Get user profile
  async getProfile(): Promise<User & { profile?: UserProfile; addresses?: Address[] }> {
    const response = await apiService.get<User & { profile?: UserProfile; addresses?: Address[] }>('/users/profile');
    return response.data;
  },

  // Update user profile
  async updateProfile(data: UpdateUserRequest): Promise<User & { profile?: UserProfile; addresses?: Address[] }> {
    const response = await apiService.put<User & { profile?: UserProfile; addresses?: Address[] }>('/users/profile', data);
    return response.data;
  },

  // Update user profile details
  async updateUserProfile(data: UpdateUserProfileRequest): Promise<UserProfile> {
    const response = await apiService.put<UserProfile>('/users/profile/details', data);
    return response.data;
  },

  // Create address
  async createAddress(data: CreateAddressRequest): Promise<Address> {
    const response = await apiService.post<Address>('/users/addresses', data);
    return response.data;
  },

  // Update address
  async updateAddress(addressId: string, data: UpdateAddressRequest): Promise<Address> {
    const response = await apiService.put<Address>(`/users/addresses/${addressId}`, data);
    return response.data;
  },

  // Delete address
  async deleteAddress(addressId: string): Promise<{ message: string }> {
    const response = await apiService.delete<{ message: string }>(`/users/addresses/${addressId}`);
    return response.data;
  },

  // Get all users (Admin only)
  async getAllUsers(query?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<PaginatedResponse<User & { _count?: { orders: number; reviews: number } }>> {
    const params = new URLSearchParams();
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiService.get<PaginatedResponse<User & { _count?: { orders: number; reviews: number } }>>(
      `/users?${params.toString()}`
    );
    return response.data;
  },

  // Update user role (Admin only)
  async updateUserRole(userId: string, role: string): Promise<User & { profile?: UserProfile; addresses?: Address[] }> {
    const response = await apiService.put<User & { profile?: UserProfile; addresses?: Address[] }>(`/users/${userId}/role`, { role });
    return response.data;
  },

  // Deactivate user (Admin only)
  async deactivateUser(userId: string): Promise<User> {
    const response = await apiService.put<User>(`/users/${userId}/deactivate`);
    return response.data;
  },
};

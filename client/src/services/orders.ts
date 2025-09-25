import { apiService } from './api';
import { Order, CreateOrderRequest, OrderQuery, PaginatedResponse } from '@/types';

export const ordersService = {
  // Create order
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await apiService.post<Order>('/orders', data);
    return response.data;
  },

  // Get user orders
  async getUserOrders(query?: OrderQuery): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiService.get<PaginatedResponse<Order>>(
      `/orders?${params.toString()}`
    );
    return response.data;
  },

  // Get all orders (Admin/Seller only)
  async getAllOrders(query?: OrderQuery): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiService.get<PaginatedResponse<Order>>(
      `/orders/all?${params.toString()}`
    );
    return response.data;
  },

  // Get order by ID
  async getOrder(id: string): Promise<Order> {
    const response = await apiService.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // Get order by order number
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await apiService.get<Order>(`/orders/number/${orderNumber}`);
    return response.data;
  },

  // Update order status
  async updateOrderStatus(id: string, data: { status?: string; paymentStatus?: string }): Promise<Order> {
    const response = await apiService.put<Order>(`/orders/${id}/status`, data);
    return response.data;
  },

  // Cancel order
  async cancelOrder(id: string): Promise<{ message: string }> {
    const response = await apiService.put<{ message: string }>(`/orders/${id}/cancel`);
    return response.data;
  },

  // Get order statistics (Admin/Seller only)
  async getOrderStats(): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
  }> {
    const response = await apiService.get<{
      totalOrders: number;
      pendingOrders: number;
      completedOrders: number;
      cancelledOrders: number;
      totalRevenue: number;
    }>('/orders/stats');
    return response.data;
  },
};

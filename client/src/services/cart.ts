import { apiService } from './api';
import { Cart, CartItem, CartSummary, AddToCartRequest, UpdateCartItemRequest } from '@/types';

export const cartService = {
  // Get user cart
  async getCart(): Promise<Cart> {
    const response = await apiService.get<Cart>('/cart');
    return response.data;
  },

  // Get cart summary
  async getCartSummary(): Promise<CartSummary> {
    const response = await apiService.get<CartSummary>('/cart/summary');
    return response.data;
  },

  // Validate cart items
  async validateCartItems(): Promise<{ isValid: boolean; errors: any[] }> {
    const response = await apiService.get<{ isValid: boolean; errors: any[] }>('/cart/validate');
    return response.data;
  },

  // Add item to cart
  async addToCart(data: AddToCartRequest): Promise<CartItem> {
    const response = await apiService.post<CartItem>('/cart/items', data);
    return response.data;
  },

  // Update cart item quantity
  async updateCartItem(itemId: string, data: UpdateCartItemRequest): Promise<CartItem> {
    const response = await apiService.put<CartItem>(`/cart/items/${itemId}`, data);
    return response.data;
  },

  // Remove item from cart
  async removeFromCart(itemId: string): Promise<{ message: string }> {
    const response = await apiService.delete<{ message: string }>(`/cart/items/${itemId}`);
    return response.data;
  },

  // Clear cart
  async clearCart(): Promise<{ message: string }> {
    const response = await apiService.delete<{ message: string }>('/cart/clear');
    return response.data;
  },
};

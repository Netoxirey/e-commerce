import { apiService } from './api';
import { Product, Category, ProductQuery, PaginatedResponse } from '@/types';

export const productsService = {
  // Get all products with filtering
  async getProducts(query?: ProductQuery): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams();
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiService.get<PaginatedResponse<Product>>(
      `/products?${params.toString()}`
    );
    return response.data;
  },

  // Get product by ID
  async getProduct(id: string): Promise<Product> {
    const response = await apiService.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Get product by slug
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await apiService.get<Product>(`/products/slug/${slug}`);
    return response.data;
  },

  // Get featured products
  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    const response = await apiService.get<Product[]>(`/products/featured?limit=${limit}`);
    return response.data;
  },

  // Get related products
  async getRelatedProducts(id: string, limit: number = 4): Promise<Product[]> {
    const response = await apiService.get<Product[]>(`/products/${id}/related?limit=${limit}`);
    return response.data;
  },

  // Create product (Admin/Seller only)
  async createProduct(data: any): Promise<Product> {
    const response = await apiService.post<Product>('/products', data);
    return response.data;
  },

  // Update product (Admin/Seller only)
  async updateProduct(id: string, data: any): Promise<Product> {
    const response = await apiService.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  // Update product inventory (Admin/Seller only)
  async updateProductInventory(id: string, quantity: number): Promise<Product> {
    const response = await apiService.patch<Product>(`/products/${id}/inventory`, { quantity });
    return response.data;
  },

  // Delete product (Admin/Seller only)
  async deleteProduct(id: string): Promise<{ message: string }> {
    const response = await apiService.delete<{ message: string }>(`/products/${id}`);
    return response.data;
  },

  // Get all categories
  async getCategories(): Promise<Category[]> {
    const response = await apiService.get<Category[]>('/categories');
    return response.data;
  },

  // Get category by ID
  async getCategory(id: string): Promise<Category> {
    const response = await apiService.get<Category>(`/categories/${id}`);
    return response.data;
  },

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await apiService.get<Category>(`/categories/slug/${slug}`);
    return response.data;
  },

  // Get category tree
  async getCategoryTree(): Promise<Category[]> {
    const response = await apiService.get<Category[]>('/categories/tree');
    return response.data;
  },

  // Create category (Admin/Seller only)
  async createCategory(data: any): Promise<Category> {
    const response = await apiService.post<Category>('/categories', data);
    return response.data;
  },

  // Update category (Admin/Seller only)
  async updateCategory(id: string, data: any): Promise<Category> {
    const response = await apiService.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  // Delete category (Admin/Seller only)
  async deleteCategory(id: string): Promise<{ message: string }> {
    const response = await apiService.delete<{ message: string }>(`/categories/${id}`);
    return response.data;
  },
};

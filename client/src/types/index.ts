// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'ADMIN' | 'CUSTOMER' | 'SELLER';
  isActive: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  avatar?: string;
  dateOfBirth?: string;
  bio?: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  title: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  comparePrice?: number;
  sku?: string;
  barcode?: string;
  trackQuantity: boolean;
  quantity: number;
  weight?: number;
  dimensions?: any;
  images: string[];
  isActive: boolean;
  isDigital: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  attributes?: ProductAttribute[];
  reviews?: Review[];
  _count?: {
    reviews: number;
  };
}

export interface ProductAttribute {
  id: string;
  productId: string;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  parent?: Category;
  children?: Category[];
  products?: Product[];
  _count?: {
    products: number;
  };
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// Cart Types
export interface Cart {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface CartSummary {
  items: CartItemWithSubtotal[];
  subtotal: number;
  itemCount: number;
  itemTypes: number;
}

export interface CartItemWithSubtotal extends CartItem {
  subtotal: number;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  total: number;
  currency: string;
  notes?: string;
  shippingAddressId: string;
  billingAddressId: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Form Types
export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface UpdateUserProfileRequest {
  avatar?: string;
  dateOfBirth?: string;
  bio?: string;
  website?: string;
}

export interface CreateAddressRequest {
  title: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {}

export interface CreateOrderRequest {
  shippingAddressId: string;
  billingAddressId: string;
  notes?: string;
}

// Query Types
export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OrderQuery {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
}

// Error Types
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
  method: string;
}

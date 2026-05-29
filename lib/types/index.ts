// Type definitions for all API responses and requests

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Types
export interface AuthRegisterRequest {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  addresses?: Address[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  costPrice?: number;
  sku: string;
  image?: string;
  images?: string[];
  category: string;
  colors?: string[];
  sizes?: string[];
  rating?: number;
  reviews?: number;
  stock: number;
  inStock: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  pages: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  costPrice?: number;
  sku: string;
  category: string;
  colors?: string[];
  sizes?: string[];
  stock: number;
  images?: string[];
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
}

// Order Types
export interface CartItem {
  productId: string;
  quantity: number;
  color?: string;
  size?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

export interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country?: string;
}

export interface CreateOrderRequest {
  items: CartItem[];
  shippingData: ShippingData;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'MPESA' | 'CYBERSOURCE' | 'BANK_TRANSFER';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
}

// Payment Types
export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  currency: string;
  mpesaCode?: string;
  cybersourceTransactionId?: string;
  status: PaymentStatus;
  failureReason?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface InitiateMpesaRequest {
  orderId: string;
  phoneNumber: string;
}

export interface InitiateMpesaResponse {
  checkoutRequestId: string;
}

export interface ProcessCyberSourceRequest {
  orderId: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

// Admin Types
export interface AdminProductListResponse {
  products: Product[];
  total: number;
}

export interface AdminOrderListResponse {
  orders: Order[];
  total: number;
}

export interface DashboardMetrics {
  pageViews: number;
  uniqueVisitors: number;
  totalEvents: number;
  avgEventsPerVisitor: number;
}

export interface SalesMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalItems: number;
  avgOrderValue: number;
}

export interface PaymentMetrics {
  totalAmount: number;
  totalCount: number;
  avgAmount: number;
  byMethod: Record<string, number>;
}

export interface DashboardResponse {
  metrics: DashboardMetrics;
  sales: SalesMetrics;
  payments: PaymentMetrics;
}

// Error Type
export interface ApiError {
  success: false;
  error: string;
}

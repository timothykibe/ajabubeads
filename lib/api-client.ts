import { ApiResponse } from '@/lib/types';

class ApiClient {
  private baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '';
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private user: any | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
      try {
        const u = localStorage.getItem('user');
        this.user = u ? JSON.parse(u) : null;
      } catch (e) {
        this.user = null;
      }
    }
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
      window.dispatchEvent(new Event('auth-changed'));
    }
  }

  setRefreshToken(token: string) {
    this.refreshToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', token);
    }
  }

  clearRefreshToken() {
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('refreshToken');
    }
  }

  setUser(user: any) {
    this.user = user;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('user', JSON.stringify(user || null));
      } catch (e) {}
      window.dispatchEvent(new Event('auth-changed'));
    }
  }

  clearUser() {
    this.user = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-changed'));
    }
  }

  clearAccessToken() {
    this.accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      window.dispatchEvent(new Event('auth-changed'));
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers as Record<string, string>);
      }
    }

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'An error occurred',
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async refreshAccessToken() {
    if (!this.refreshToken) return null;
    const res = await this.post<{ accessToken: string; user: any }>('/api/auth/refresh', { refreshToken: this.refreshToken });
    if (res.success && (res.data as any).accessToken) {
      this.setAccessToken((res.data as any).accessToken);
      if ((res.data as any).user) this.setUser((res.data as any).user);
      return res.data;
    }
    return null;
  }

  private get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  private post<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  private put<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  private delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Auth endpoints
  auth = {
    register: (data: any) => this.post('/api/auth/register', data),
    login: (data: any) => this.post('/api/auth/login', data),
    googleLogin: (data: any) => this.post('/api/auth/google', data),
    getProfile: () => this.get('/api/auth/profile'),
    updateProfile: (data: any) => this.put('/api/auth/profile', data),
  };

  // Product endpoints
  products = {
    getAll: (params?: { skip?: number; take?: number; category?: string; search?: string }) =>
      this.get(`/api/products?${new URLSearchParams(params as any).toString()}`),
    getById: (id: string) => this.get(`/api/products/${id}`),
    getFeatured: () => this.get('/api/products?featured=true'),
  };

  // Order endpoints
  orders = {
    create: (data: any) => this.post('/api/orders', data),
    getAll: (params?: { skip?: number; take?: number }) =>
      this.get(`/api/orders?${new URLSearchParams(params as any).toString()}`),
    getById: (id: string) => this.get(`/api/orders/${id}`),
  };

  // Payment endpoints
  payments = {
    initiateMpesa: (data: any) => this.post('/api/payments/mpesa/initiate', data),
    processCyberSource: (data: any) => this.post('/api/payments/cybersource', data),
  };

  // Admin endpoints
  admin = {
    products: {
      getAll: (params?: any) =>
        this.get(`/api/admin/products?${new URLSearchParams(params).toString()}`),
      create: (data: any) => this.post('/api/admin/products', data),
      update: (id: string, data: any) => this.put(`/api/admin/products/${id}`, data),
      delete: (id: string) => this.delete(`/api/admin/products/${id}`),
    },
    orders: {
      getAll: (params?: any) =>
        this.get(`/api/admin/orders?${new URLSearchParams(params).toString()}`),
    },
    analytics: {
      getDashboard: (days?: number) =>
        this.get(`/api/admin/analytics?type=dashboard&days=${days || 30}`),
      getConversion: (days?: number) =>
        this.get(`/api/admin/analytics?type=conversion&days=${days || 30}`),
      getTraffic: (days?: number) =>
        this.get(`/api/admin/analytics?type=traffic&days=${days || 30}`),
    },
  };
}

export const apiClient = new ApiClient();

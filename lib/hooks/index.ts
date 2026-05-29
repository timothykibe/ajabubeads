'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Product, ProductListResponse, Order, OrderListResponse, ApiResponse } from '@/lib/types';

// Generic fetch hook
export function useFetch<T>(
  fetcher: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      const response = await fetcher();
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'An error occurred');
      }
      setLoading(false);
    };

    fetch();
  }, dependencies);

  return { data, loading, error, refetch: () => fetcher() };
}

// Products hooks
export function useProducts(skip: number = 0, take: number = 12, category?: string) {
  return useFetch(
    () => apiClient.products.getAll({ skip, take, category }),
    [skip, take, category]
  );
}

export function useProduct(id: string) {
  return useFetch(
    () => apiClient.products.getById(id),
    [id]
  );
}

export function useFeaturedProducts() {
  return useFetch(() => apiClient.products.getFeatured());
}

export function useSearchProducts(search: string) {
  return useFetch(
    () => apiClient.products.getAll({ search }),
    [search]
  );
}

// Orders hooks
export function useOrders(skip: number = 0, take: number = 10) {
  return useFetch(
    () => apiClient.orders.getAll({ skip, take }),
    [skip, take]
  );
}

export function useOrder(id: string) {
  return useFetch(
    () => apiClient.orders.getById(id),
    [id]
  );
}

export function useCreateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (data: any) => {
    setLoading(true);
    setError(null);
    const response = await apiClient.orders.create(data);
    setLoading(false);

    if (!response.success) {
      setError(response.error || 'Failed to create order');
      return null;
    }

    return response.data;
  };

  return { createOrder, loading, error };
}

// Payment hooks
export function useInitiateMpesa() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiate = async (orderId: string, phoneNumber: string) => {
    setLoading(true);
    setError(null);
    const response = await apiClient.payments.initiateMpesa({ orderId, phoneNumber });
    setLoading(false);

    if (!response.success) {
      setError(response.error || 'Failed to initiate payment');
      return null;
    }

    return response.data;
  };

  return { initiate, loading, error };
}

export function useProcessCyberSource() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const process = async (data: any) => {
    setLoading(true);
    setError(null);
    const response = await apiClient.payments.processCyberSource(data);
    setLoading(false);

    if (!response.success) {
      setError(response.error || 'Failed to process payment');
      return null;
    }

    return response.data;
  };

  return { process, loading, error };
}

// Auth hooks
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const response = await apiClient.auth.login({ email, password });
    setLoading(false);

    if (!response.success) {
      setError(response.error || 'Login failed');
      return null;
    }

    const data = response.data as any;
    apiClient.setAccessToken(data.accessToken);
    if (data.refreshToken) apiClient.setRefreshToken(data.refreshToken);
    apiClient.setUser(data.user);
    setUser(data.user);
    return data;
  };

  const loginWithGoogle = async (credential: string) => {
    setLoading(true);
    setError(null);
    const response = await apiClient.auth.googleLogin({ credential });
    setLoading(false);

    if (!response.success) {
      setError(response.error || 'Google login failed');
      return null;
    }

    const data = response.data as any;
    apiClient.setAccessToken(data.accessToken);
    if (data.refreshToken) apiClient.setRefreshToken(data.refreshToken);
    apiClient.setUser(data.user);
    setUser(data.user);
    return data;
  };

  const register = async (email: string, password: string, name?: string, phone?: string) => {
    setLoading(true);
    setError(null);
    const response = await apiClient.auth.register({ email, password, name, phone });
    setLoading(false);

    if (!response.success) {
      setError(response.error || 'Registration failed');
      return null;
    }

    const data = response.data as any;
    apiClient.setAccessToken(data.accessToken);
    if (data.refreshToken) apiClient.setRefreshToken(data.refreshToken);
    apiClient.setUser(data.user);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    apiClient.clearAccessToken();
    apiClient.clearRefreshToken();
    apiClient.clearUser();
    setUser(null);
  };

  const getProfile = async () => {
    setLoading(true);
    const response = await apiClient.auth.getProfile();
    setLoading(false);

    if (response.success && response.data) {
      setUser(response.data);
      apiClient.setUser(response.data);
      return response.data;
    }
  };

  // Try to restore session from refresh token
  useEffect(() => {
    const tryRestore = async () => {
      if (!user && typeof window !== 'undefined') {
        const access = localStorage.getItem('accessToken');
        const refresh = localStorage.getItem('refreshToken');
        if (!access && refresh) {
          await apiClient.refreshAccessToken();
          const profile = await apiClient.auth.getProfile();
          if (profile.success && profile.data) {
            setUser(profile.data);
            apiClient.setUser(profile.data);
          }
        } else if (access && !user) {
          const profile = await apiClient.auth.getProfile();
          if (profile.success && profile.data) {
            setUser(profile.data);
            apiClient.setUser(profile.data);
          }
        }
      }
    };

    tryRestore();
  }, []);

  return { user, loading, error, login, loginWithGoogle, register, logout, getProfile };
}

// Admin hooks
export function useAdminProducts(skip: number = 0, take: number = 10) {
  return useFetch(
    () => apiClient.admin.products.getAll({ skip, take }),
    [skip, take]
  );
}

export function useCreateAdminProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: any) => {
    setLoading(true);
    setError(null);
    const response = await apiClient.admin.products.create(data);
    setLoading(false);

    if (!response.success) {
      setError(response.error || 'Failed to create product');
      return null;
    }

    return response.data;
  };

  return { create, loading, error };
}

export function useUpdateAdminProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, data: any) => {
    setLoading(true);
    setError(null);
    const response = await apiClient.admin.products.update(id, data);
    setLoading(false);

    if (!response.success) {
      setError(response.error || 'Failed to update product');
      return null;
    }

    return response.data;
  };

  return { update, loading, error };
}

export function useDeleteAdminProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const delete_ = async (id: string) => {
    setLoading(true);
    setError(null);
    const response = await apiClient.admin.products.delete(id);
    setLoading(false);

    if (!response.success) {
      setError(response.error || 'Failed to delete product');
      return false;
    }

    return true;
  };

  return { delete: delete_, loading, error };
}

export function useAdminOrders(skip: number = 0, take: number = 10) {
  return useFetch(
    () => apiClient.admin.orders.getAll({ skip, take }),
    [skip, take]
  );
}

export function useDashboardAnalytics(days: number = 30) {
  return useFetch(
    () => apiClient.admin.analytics.getDashboard(days),
    [days]
  );
}

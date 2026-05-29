// Formatting utilities
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

// String utilities
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncate = (str: string, length: number = 100): string => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+?254|0)?[71]\d{8}$/;
  return phoneRegex.test(phone);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Cart calculations
export const calculateSubtotal = (items: any[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const calculateTax = (subtotal: number, taxRate: number = 0.16): number => {
  return Math.round(subtotal * taxRate);
};

export const calculateShipping = (subtotal: number, freeShippingThreshold: number = 5000): number => {
  return subtotal >= freeShippingThreshold ? 0 : 500;
};

export const calculateTotal = (
  subtotal: number,
  taxRate: number = 0.16,
  freeShippingThreshold: number = 5000
): { subtotal: number; tax: number; shipping: number; total: number } => {
  const tax = calculateTax(subtotal, taxRate);
  const shipping = calculateShipping(subtotal, freeShippingThreshold);
  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
};

// Array utilities
export const groupBy = <T>(arr: T[], key: keyof T): Record<string, T[]> => {
  return arr.reduce((acc, item) => {
    const groupKey = String(item[key]);
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};

export const uniqueBy = <T>(arr: T[], key: keyof T): T[] => {
  return arr.filter((item, index, self) =>
    index === self.findIndex(t => t[key] === item[key])
  );
};

// Object utilities
export const omit = <T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Partial<T> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const pick = <T extends Record<string, any>>(obj: T, keys: (keyof T)[]): Partial<T> => {
  const result = {} as Partial<T>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

// Local storage utilities
export const setLocalStorage = (key: string, value: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getLocalStorage = <T>(key: string, defaultValue?: T): T | null => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  }
  return defaultValue || null;
};

export const removeLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

// Delay utility
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Class name utility
export const cn = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

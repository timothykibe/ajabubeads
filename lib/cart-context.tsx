'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { calculateTotal } from '@/lib/helpers';

export interface CartItemWithProduct extends Product {
  quantity: number;
  color?: string;
  size?: string;
}

interface CartContextType {
  items: CartItemWithProduct[];
  addItem: (product: Product, quantity: number, color?: string, size?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateItemVariant: (productId: string, color?: string, size?: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemWithProduct[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity: number, color?: string, size?: string) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.color === color && item.size === size
      );
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id && item.color === color && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prevItems,
        {
          ...product,
          quantity,
          color,
          size,
        },
      ];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateItemVariant = (productId: string, color?: string, size?: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, color, size } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const { tax, shipping, total } = calculateTotal(subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateItemVariant,
        clearCart,
        cartCount,
        subtotal,
        tax,
        shipping,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (undefined === context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

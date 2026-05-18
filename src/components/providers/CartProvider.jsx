'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthProvider';

const CartContext = createContext(undefined);

export function CartProvider({  children  }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => {
    const price = item.product ? Number(item.product.price) : 0;
    return sum + price * item.quantity;
  }, 0);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setItems(data.data || []);
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (productId, quantity = 1) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await refreshCart();
        return { success: true };
      }
      return { success: false, error: data.error || 'Failed to add item' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
    try {
      await fetch(`/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
    } catch {
      refreshCart();
    }
  };

  const removeItem = async (cartItemId) => {
    // Optimistic update
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
    try {
      await fetch(`/api/cart/${cartItemId}`, { method: 'DELETE' });
    } catch {
      refreshCart();
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{ items, count, total, isLoading, addItem, updateQuantity, removeItem, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

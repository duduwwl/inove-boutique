"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

export type CartItem = { productId: string; size: string; color: string; quantity: number };
type ShopState = {
  cart: CartItem[];
  favorites: string[];
  cartOpen: boolean;
  coupon: string;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateItem: (productId: string, size: string, color: string, quantity: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  toggleFavorite: (productId: string) => void;
  setCartOpen: (open: boolean) => void;
  setCoupon: (coupon: string) => void;
  clearCart: () => void;
};

const fallback = new Map<string, string>();
const safeStorage: StateStorage = {
  getItem: (name) => { try { return localStorage.getItem(name); } catch { return fallback.get(name) ?? null; } },
  setItem: (name, value) => { try { localStorage.setItem(name, value); } catch { fallback.set(name, value); } },
  removeItem: (name) => { try { localStorage.removeItem(name); } catch { fallback.delete(name); } },
};

const sameItem = (item: CartItem, productId: string, size: string, color: string) => item.productId === productId && item.size === size && item.color === color;

export const useShopStore = create<ShopState>()(persist((set) => ({
  cart: [], favorites: [], cartOpen: false, coupon: "",
  addItem: (entry, quantity = 1) => set((state) => {
    const found = state.cart.find((item) => sameItem(item, entry.productId, entry.size, entry.color));
    return { cart: found
      ? state.cart.map((item) => sameItem(item, entry.productId, entry.size, entry.color) ? { ...item, quantity: item.quantity + quantity } : item)
      : [...state.cart, { ...entry, quantity }], cartOpen: true };
  }),
  updateItem: (productId, size, color, quantity) => set((state) => ({ cart: state.cart
    .map((item) => sameItem(item, productId, size, color) ? { ...item, quantity } : item)
    .filter((item) => item.quantity > 0) })),
  removeItem: (productId, size, color) => set((state) => ({ cart: state.cart.filter((item) => !sameItem(item, productId, size, color)) })),
  toggleFavorite: (productId) => set((state) => ({ favorites: state.favorites.includes(productId)
    ? state.favorites.filter((id) => id !== productId) : [...state.favorites, productId] })),
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setCoupon: (coupon) => set({ coupon }),
  clearCart: () => set({ cart: [], coupon: "" }),
}), {
  name: "inove-shop", version: 1, storage: createJSONStorage(() => safeStorage),
  merge: (persisted, current) => {
    const saved = persisted as Partial<ShopState>;
    return {
      ...current,
      ...saved,
      cart: current.cart.length ? current.cart : saved.cart ?? [],
      favorites: current.favorites.length ? current.favorites : saved.favorites ?? [],
      cartOpen: current.cartOpen,
    };
  },
  partialize: ({ cart, favorites, coupon }) => ({ cart, favorites, coupon }),
}));

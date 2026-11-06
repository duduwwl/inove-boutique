"use client";

import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

export type CartItem = { productId: string; size: string; color: string; quantity: number };
type PersistedShopState = { cart: CartItem[]; favorites: string[]; coupon: string };
type ShopState = {
  cart: CartItem[];
  favorites: string[];
  cartOpen: boolean;
  coupon: string;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateItem: (productId: string, size: string, color: string, quantity: number) => void;
  changeItem: (productId: string, size: string, color: string, nextSize: string, nextColor: string) => void;
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

export function normalizePersistedShopState(value: unknown): PersistedShopState {
  const saved = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const cart = Array.isArray(saved.cart) ? saved.cart.filter((item): item is CartItem => {
    if (!item || typeof item !== "object") return false;
    const entry = item as Record<string, unknown>;
    return typeof entry.productId === "string" && typeof entry.size === "string" && typeof entry.color === "string" && typeof entry.quantity === "number" && Number.isFinite(entry.quantity) && entry.quantity > 0;
  }) : [];
  const favorites = Array.isArray(saved.favorites) ? [...new Set(saved.favorites.filter((id): id is string => typeof id === "string"))] : [];
  return { cart, favorites, coupon: typeof saved.coupon === "string" ? saved.coupon : "" };
}

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
  changeItem: (productId, size, color, nextSize, nextColor) => set((state) => {
    const source = state.cart.find((item) => sameItem(item, productId, size, color));
    if (!source || (size === nextSize && color === nextColor)) return state;
    const remaining = state.cart.filter((item) => !sameItem(item, productId, size, color));
    const target = remaining.find((item) => sameItem(item, productId, nextSize, nextColor));
    return { cart: target
      ? remaining.map((item) => sameItem(item, productId, nextSize, nextColor) ? { ...item, quantity: item.quantity + source.quantity } : item)
      : [...remaining, { ...source, size: nextSize, color: nextColor }] };
  }),
  removeItem: (productId, size, color) => set((state) => ({ cart: state.cart.filter((item) => !sameItem(item, productId, size, color)) })),
  toggleFavorite: (productId) => set((state) => ({ favorites: state.favorites.includes(productId)
    ? state.favorites.filter((id) => id !== productId) : [...state.favorites, productId] })),
  setCartOpen: (cartOpen) => set({ cartOpen }),
  setCoupon: (coupon) => set({ coupon }),
  clearCart: () => set({ cart: [], coupon: "" }),
}), {
  name: "inove-shop", version: 1, storage: createJSONStorage(() => safeStorage),
  merge: (persisted, current) => {
    const saved = normalizePersistedShopState(persisted);
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

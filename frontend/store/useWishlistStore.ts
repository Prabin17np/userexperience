import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface WishlistStore {
  items: Product[];

  // Actions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  clearWishlist: () => void;

  // Computed
  isInWishlist: (productId: string) => boolean;
  getTotalItems: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        if (!get().isInWishlist(product.id)) {
          set((state) => ({ items: [...state.items, product] }));
        }
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      toggleItem: (product: Product) => {
        if (get().isInWishlist(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.id === productId);
      },

      getTotalItems: () => {
        return get().items.length;
      },
    }),
    {
      name: 'solely-wishlist',
      skipHydration: true,
    }
  )
);
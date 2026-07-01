import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Match frontend Product type exactly — images are strings
export interface CartProduct {
  _id?: string;
  id: string;           // frontend uses id
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];     // ← string[] not {url,publicId}[]
  sizes: { value: string; inStock: boolean }[];
  colors: { name: string; hex: string }[];
  slug: string;
  badge?: 'NEW' | 'SALE';
  collection: string;
  tags: string[];
  accordionItems: { title: string; content: string }[];
}

export interface CartItem {
  id: string;
  product: CartProduct;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 150;
const SHIPPING_COST = 15;

const PROMO_CODES: Record<string, number> = {
  SOLELY10:  0.1,
  SOLELY20:  0.2,
  WELCOME15: 0.15,
};

interface AddToCartPayload {
  product: CartProduct;
  selectedColor: string;
  selectedSize: string;
  quantity?: number;
}

interface CartStore {
  items: CartItem[];
  promoCode: string;
  promoDiscount: number;
  isCartOpen: boolean;

  addItem: (payload: AddToCartPayload) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  getSummary: () => CartSummary;
  getTotalItems: () => number;
  totalPrice: () => number;
  isInCart: (productId: string, size: string, color: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: '',
      promoDiscount: 0,
      isCartOpen: false,

      addItem: ({ product, selectedColor, selectedSize, quantity = 1 }) => {
        const productId = product.id;
        const existing = get().items.find(
          (item) =>
            item.product.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
        );

        if (existing) {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === existing.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          const newItem: CartItem = {
            id: `${productId}_${selectedColor}_${selectedSize}_${Date.now()}`,
            product,
            selectedColor,
            selectedSize,
            quantity,
          };
          set((state) => ({ items: [...state.items, newItem] }));
        }
      },

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        })),

      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [], promoCode: '', promoDiscount: 0 }),

      applyPromoCode: (code) => {
        const discount = PROMO_CODES[code.toUpperCase()];
        if (discount) {
          set({ promoCode: code.toUpperCase(), promoDiscount: discount });
          return true;
        }
        return false;
      },

      removePromoCode: () => set({ promoCode: '', promoDiscount: 0 }),

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      openCart:   () => set({ isCartOpen: true }),
      closeCart:  () => set({ isCartOpen: false }),

      getSummary: (): CartSummary => {
        const { items, promoDiscount } = get();
        const subtotal = items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        const discount = subtotal * promoDiscount;
        const discountedSubtotal = subtotal - discount;
        const shipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
        const tax = discountedSubtotal * TAX_RATE;
        const total = discountedSubtotal + shipping + tax;
        return {
          subtotal,
          shipping,
          tax: parseFloat(tax.toFixed(2)),
          discount: parseFloat(discount.toFixed(2)),
          total: parseFloat(total.toFixed(2)),
        };
      },

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),

      isInCart: (productId, size, color) =>
        get().items.some(
          (item) =>
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
        ),
    }),
    {
      name: 'solely-cart',
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode,
        promoDiscount: state.promoDiscount,
      }),
    }
  )
);
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ordersApi } from '@/lib/api/orders';
import type { Order } from '@/lib/api/orders';
import { useCartStore } from './useCartStore';
import { redirectToEsewa } from '@/lib/esewaRedirect';
import { paymentApi } from '@/lib/api/payment';

//ypes

export type CheckoutStep = 1 | 2 | 3;
export type ShippingMethod = 'standard' | 'express';
export type FrontendPaymentMethod = 'credit_card' | 'esewa' | 'fonepay';

export interface CheckoutAddress {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string; // maps to addressLine1 on backend
}

export const SHIPPING_COSTS: Record<ShippingMethod, number> = {
  standard: 0,  // Free shipping
  express: 15,  // Express shipping fee
};

// Tax rate (8%)
export const TAX_RATE = 0.08;

// Map frontend payment → backend PaymentMethod
const mapPaymentMethod = (
  method: FrontendPaymentMethod
): 'COD' | 'Card' | 'UPI' | 'NetBanking' => {
  switch (method) {
    case 'credit_card': return 'Card';
    case 'esewa':       return 'UPI';
    case 'fonepay':     return 'NetBanking';
    default:            return 'COD';
  }
};

// Store interface 

interface CheckoutStore {
  step: CheckoutStep;
  address: CheckoutAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: FrontendPaymentMethod;
  paymentDetails: {
    method: FrontendPaymentMethod;
    creditCard?: {
      cardholderName: string;
      cardNumber: string;
      expiry: string;
      cvv: string;
    };
    billingAddressSameAsShipping: boolean;
  };
  isProcessing: boolean;
  orderComplete: boolean;
  orderId: string | null;
  currentOrder: Order | null;
  error: string | null;

  // Actions
  setStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setAddress: (address: CheckoutAddress) => void;
  setShippingMethod: (method: ShippingMethod) => void;
  setPaymentMethod: (method: FrontendPaymentMethod) => void;
  setPaymentDetails: (details: Partial<CheckoutStore['paymentDetails']>) => void;
  placeOrder: () => Promise<void>;
  resetCheckout: () => void;

  // Computed helpers
  getShippingCost: () => number;
  getOrderTotal: () => { subtotal: number; shipping: number; tax: number; total: number };
}

//Defaults

const DEFAULT_ADDRESS: CheckoutAddress = {
  fullName: '',
  phone: '',
  email: '',
  city: '',
  address: '',
};

//Store

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      step: 1,
      address: DEFAULT_ADDRESS,
      shippingMethod: 'standard',
      paymentMethod: 'credit_card',
      paymentDetails: { method: 'credit_card',billingAddressSameAsShipping: true, },
      isProcessing: false,
      orderComplete: false,
      orderId: null,
      currentOrder: null,
      error: null,

      setStep: (step) => set({ step }),
      nextStep: () => {
        const s = get().step;
        if (s < 3) set({ step: (s + 1) as CheckoutStep });
      },
      prevStep: () => {
        const s = get().step;
        if (s > 1) set({ step: (s - 1) as CheckoutStep });
      },
      setAddress: (address) => set({ address }),
      setShippingMethod: (method) => set({ shippingMethod: method }),
      setPaymentMethod: (method) => set({
        paymentMethod: method,
        paymentDetails: { ...get().paymentDetails, method },
      }),
      setPaymentDetails: (details) => set((s) => ({
        paymentDetails: { ...s.paymentDetails, ...details },
      })),

      //Computed
      getShippingCost: () => SHIPPING_COSTS[get().shippingMethod],

      getOrderTotal: () => {
        const cartItems = useCartStore.getState().items;
        const subtotal = cartItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity, 0
        );
        const shipping = SHIPPING_COSTS[get().shippingMethod];
        const tax = parseFloat(((subtotal + shipping) * TAX_RATE).toFixed(2));
        const total = parseFloat((subtotal + shipping + tax).toFixed(2));
        return { subtotal, shipping, tax, total };
      },

      //Place order
      placeOrder: async () => {
        set({ isProcessing: true, error: null });

        const { address, paymentMethod } = get();
        const cartItems = useCartStore.getState().items;
        const { total } = get().getOrderTotal();

        if (cartItems.length === 0) {
          set({ isProcessing: false, error: 'Your cart is empty.' });
          return;
        }

        try {
          const order = await ordersApi.createOrder({
            items: cartItems.map((item) => ({
              productId: item.product.id,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              size: item.selectedSize,
            })),
            totalAmount: total,
            paymentMethod: mapPaymentMethod(paymentMethod),
            shippingAddress: {
              fullName: address.fullName,
              phone: address.phone,
              addressLine1: address.address,
              city: address.city,
              state: 'N/A',
              postalCode: 'N/A',
              country: 'N/A',
            },
          });

          set({ currentOrder: order, orderId: order._id });

          if (paymentMethod === 'esewa') {
  const { paymentUrl, formData } = await paymentApi.initiateEsewa(order._id);
  redirectToEsewa(paymentUrl, formData);
  return;
}

          // COD / other methods that resolve immediately
          useCartStore.getState().clearCart();
          set({ isProcessing: false, orderComplete: true });
        } catch (err) {
          const message = extractError(err);
          set({ isProcessing: false, error: message });
          throw new Error(message);
        }
      },

      resetCheckout: () => set({
        step: 1,
        address: DEFAULT_ADDRESS,
        shippingMethod: 'standard',
        paymentMethod: 'credit_card',
        paymentDetails: { method: 'credit_card', billingAddressSameAsShipping: true },
        isProcessing: false,
        orderComplete: false,
        orderId: null,
        currentOrder: null,
        error: null,
      }),
    }),
    {
      name: 'solely-checkout',
      partialize: (state) => ({
        step: state.step,
        address: state.address,
        shippingMethod: state.shippingMethod,
        paymentMethod: state.paymentMethod,
        paymentDetails: state.paymentDetails,
      }),
    }
  )
);

//Helper
const extractError = (err: unknown): string => {
  if (
    err &&
    typeof err === 'object' &&
    'response' in err &&
    err.response &&
    typeof err.response === 'object' &&
    'data' in err.response
  ) {
    const d = err.response.data as { message?: string };
    return d.message || 'Something went wrong';
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong';
};
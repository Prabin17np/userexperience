import { create } from 'zustand';
import { ordersApi, Order, PaginatedOrders } from '@/lib/api/orders';
import { adminApi } from '@/lib/api/admin';
import { OrderStatus, PaymentStatus } from '@/lib/api/orders';

interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;

  fetchMyOrders: (page?: number) => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;

  // Admin
  fetchAllOrders: (page?: number) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus, paymentStatus?: PaymentStatus) => Promise<void>;

  clearError: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  currentOrder: null,
  total: 0,
  page: 1,
  totalPages: 1,
  isLoading: false,
  error: null,

  fetchMyOrders: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const result: PaginatedOrders = await ordersApi.getMyOrders(page);
      set({ ...result, isLoading: false });
    } catch (err) {
      set({ error: extractError(err), isLoading: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const order = await ordersApi.getOrderById(id);
      set({ currentOrder: order, isLoading: false });
    } catch (err) {
      set({ error: extractError(err), isLoading: false });
    }
  },

  fetchAllOrders: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const result: PaginatedOrders = await adminApi.getAllOrders(page);
      set({ ...result, isLoading: false });
    } catch (err) {
      set({ error: extractError(err), isLoading: false });
    }
  },

  updateOrderStatus: async (id, orderStatus, paymentStatus) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await adminApi.updateOrderStatus(id, orderStatus, paymentStatus);
      set((s) => ({
        orders: s.orders.map((o) => (o._id === id ? updated : o)),
        currentOrder: s.currentOrder?._id === id ? updated : s.currentOrder,
        isLoading: false,
      }));
    } catch (err) {
      set({ error: extractError(err), isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

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
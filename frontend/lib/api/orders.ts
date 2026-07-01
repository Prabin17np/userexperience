import api from './axios';
import { ENDPOINTS } from './endpoint';

export type PaymentMethod = 'COD' | 'Card' | 'UPI' | 'NetBanking';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';
export type OrderStatus =
  | 'Order Placed'
  | 'Packing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  user: { _id: string; name: string; email: string } | string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  shippingAddress: ShippingAddress;
}

export interface PaginatedOrders {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
}

export const ordersApi = {
  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const { data } = await api.post(ENDPOINTS.ORDERS.BASE, payload);
    return data.data.order;
  },

  getMyOrders: async (page = 1, limit = 10): Promise<PaginatedOrders> => {
    const { data } = await api.get(
      `${ENDPOINTS.ORDERS.MY_ORDERS}?page=${page}&limit=${limit}`
    );
    return data.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const { data } = await api.get(ENDPOINTS.ORDERS.BY_ID(id));
    return data.data.order;
  },
};
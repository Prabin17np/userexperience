import api from './axios';
import { ENDPOINTS } from './endpoint';
import { Order, OrderStatus, PaymentStatus, PaginatedOrders } from './orders';

export const adminApi = {
  getAllOrders: async (page = 1, limit = 20): Promise<PaginatedOrders> => {
    const { data } = await api.get(
      `${ENDPOINTS.ADMIN.ALL_ORDERS}?page=${page}&limit=${limit}`
    );
    return data.data;
  },

  updateOrderStatus: async (
    id: string,
    orderStatus: OrderStatus,
    paymentStatus?: PaymentStatus
  ): Promise<Order> => {
    const { data } = await api.put(ENDPOINTS.ADMIN.UPDATE_ORDER_STATUS(id), {
      orderStatus,
      ...(paymentStatus && { paymentStatus }),
    });
    return data.data.order;
  },
};
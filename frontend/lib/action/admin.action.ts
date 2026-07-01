import { adminApi } from '../api/admin';
import { productsApi } from '../api/products';
import { OrderStatus, PaymentStatus } from '../api/orders';

export const getAllOrdersAction = async (page = 1, limit = 20) => {
  return adminApi.getAllOrders(page, limit);
};

export const updateOrderStatusAction = async (
  id: string,
  orderStatus: OrderStatus,
  paymentStatus?: PaymentStatus
) => {
  return adminApi.updateOrderStatus(id, orderStatus, paymentStatus);
};

// Accepts FormData directly — built in AddItemsPage
export const createProductAction = async (formData: FormData) => {
  return productsApi.createProduct(formData);
};

export const updateProductAction = async (id: string, formData: FormData) => {
  return productsApi.updateProduct(id, formData);
};

export const deleteProductAction = async (id: string) => {
  return productsApi.deleteProduct(id);
};
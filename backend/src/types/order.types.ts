import { Document, Types } from 'mongoose';

export type PaymentMethod = 'COD' | 'Card' | 'UPI' | 'NetBanking';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';
export type OrderStatus =
  | 'Order Placed'
  | 'Packing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered';

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  size: string;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: IShippingAddress;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderBody {
  items: IOrderItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  shippingAddress: IShippingAddress;
}

export interface UpdateOrderStatusBody {
  orderStatus: OrderStatus;
  paymentStatus?: PaymentStatus;
}
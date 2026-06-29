import { Types } from 'mongoose';
import Order from '../models/order.model';
import {
  IOrder,
  CreateOrderBody,
  UpdateOrderStatusBody,
} from '../types/order.types';
import AppError from '../utils/AppError';

interface PaginatedOrders {
  orders: IOrder[];
  total: number;
  page: number;
  totalPages: number;
}

class OrderService {
  async createOrder(userId: string, body: CreateOrderBody): Promise<IOrder> {
    const order = await Order.create({ user: userId, ...body });
    return order.populate('user', 'name email');
  }

  async getUserOrders(
    userId: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedOrders> {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({ user: userId }),
    ]);

    return {
      orders: orders as unknown as IOrder[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getAllOrders(page = 1, limit = 20): Promise<PaginatedOrders> {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(),
    ]);

    return {
      orders: orders as unknown as IOrder[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateOrderStatus(
    id: string,
    body: UpdateOrderStatusBody
  ): Promise<IOrder> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid order ID.', 400);
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: body.orderStatus, ...(body.paymentStatus && { paymentStatus: body.paymentStatus }) },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!order) throw new AppError('Order not found.', 404);
    return order;
  }

  async getOrderById(id: string, userId?: string): Promise<IOrder> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid order ID.', 400);
    }

    const filter: Record<string, unknown> = { _id: id };
    if (userId) filter.user = userId; // Scope to user if not admin

    const order = await Order.findOne(filter).populate('user', 'name email');
    if (!order) throw new AppError('Order not found.', 404);
    return order;
  }
}

export default new OrderService();
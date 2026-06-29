import { Response } from 'express';
import orderService from '../services/order.service';
import { AuthRequest } from '../types/auth.types';
import { sendSuccess, sendCreated } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';

export const createOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const order = await orderService.createOrder(
      req.user!._id.toString(),
      req.body
    );
    sendCreated(res, 'Order placed successfully.', { order });
  }
);

export const getMyOrders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await orderService.getUserOrders(
      req.user!._id.toString(),
      page,
      limit
    );
    sendSuccess(res, 'Orders retrieved successfully.', result);
  }
);

export const getOrderDetails = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const order = await orderService.getOrderById(
      req.params['id'] as string,
      req.user!._id.toString()
    );
    sendSuccess(res, 'Order retrieved successfully.', { order });
  }
);
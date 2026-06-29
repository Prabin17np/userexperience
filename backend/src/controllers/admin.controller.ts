import { Request, Response } from 'express';
import orderService from '../services/order.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';

export const getAllOrders = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await orderService.getAllOrders(page, limit);
    sendSuccess(res, 'All orders retrieved successfully.', result);
  }
);

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const order = await orderService.updateOrderStatus(req.params['id'] as string, req.body);
    sendSuccess(res, 'Order status updated successfully.', { order });
  }
);
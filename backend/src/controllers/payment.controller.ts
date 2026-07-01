import { Request, Response } from 'express';
import { buildEsewaPayload, verifyEsewaStatus } from '../utils/esewa';
import { asyncHandler } from '../middleware/error.middleware';
import { sendSuccess } from '../utils/response';
import Order from '../models/order.model';
import AppError from '../utils/AppError';

const isMockMode = (): boolean => process.env.MOCK_PAYMENTS === 'true';

//Initiate eSewa Payment 
// Generates the signed form payload the frontend will submit to eSewa
// (or to our mock gateway page when MOCK_PAYMENTS=true).
export const initiateEsewaPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) throw new AppError('Order not found.', 404);

    if (order.paymentStatus === 'Paid') {
      throw new AppError('This order has already been paid.', 400);
    }

    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      throw new AppError('FRONTEND_URL is not configured on the server.', 500);
    }

    const payload = buildEsewaPayload(
      order._id.toString(),
      order.totalAmount,
      `${frontendUrl}/checkout/esewa/success`,
      `${frontendUrl}/checkout/esewa/failure`
    );

    // In demo/mock mode, route to our own fake gateway page instead of eSewa
    const paymentUrl = isMockMode()
      ? `${frontendUrl}/checkout/esewa/mock`
      : process.env.ESEWA_PAYMENT_URL;

    if (!paymentUrl) {
      throw new AppError('ESEWA_PAYMENT_URL is not configured on the server.', 500);
    }

    sendSuccess(res, 'eSewa payment initiated.', {
      paymentUrl,
      formData: payload,
    });
  }
);

// ─── Verify eSewa Payment ───────────────────────────────────────────────────
// Called by the frontend after the user returns from eSewa (or the mock page)
// with the base64-encoded `data` query param.
export const verifyEsewaPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { data } = req.body;
    if (!data || typeof data !== 'string') {
      throw new AppError('Missing eSewa response data.', 400);
    }

    let decoded: {
      transaction_uuid?: string;
      total_amount?: string | number;
      status?: string;
    };

    try {
      decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
    } catch {
      throw new AppError('Invalid eSewa response data.', 400);
    }

    const { transaction_uuid, total_amount, status } = decoded;

    if (!transaction_uuid || !total_amount) {
      throw new AppError('Malformed eSewa response data.', 400);
    }

    if (status !== 'COMPLETE') {
      throw new AppError('Payment was not completed.', 400);
    }

    // Defense in depth: re-verify with eSewa's status API.
    // Skipped in mock mode since there's no real eSewa transaction to check.
    if (!isMockMode()) {
      const verified = await verifyEsewaStatus(
        Number(total_amount),
        transaction_uuid
      );
      if (verified.status !== 'COMPLETE') {
        throw new AppError('Payment verification failed.', 400);
      }
    }

    // transaction_uuid is built as `${orderId}-${timestamp}` — extract the orderId
    const orderId = transaction_uuid.split('-')[0];

    const order = await Order.findById(orderId);
    if (!order) throw new AppError('Order not found.', 404);

    // Idempotency: don't double-process an already-paid order
    if (order.paymentStatus === 'Paid') {
      return sendSuccess(res, 'Payment already verified.', { order });
    }

    // Sanity check: paid amount should match the order total
    if (Number(total_amount) !== order.totalAmount) {
      throw new AppError('Payment amount mismatch.', 400);
    }

    order.paymentStatus = 'Paid';
    order.orderStatus = 'Order Placed';
    await order.save();

    sendSuccess(res, 'Payment verified successfully.', { order });
  }
);
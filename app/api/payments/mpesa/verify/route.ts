import { NextRequest } from 'next/server';
import { orderRepository } from '@/lib/db/order.repository';
import { paymentRepository } from '@/lib/db/payment.repository';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';

// POST /api/payments/mpesa/verify
export async function POST(request: NextRequest) {
  try {
    // Verify guest token
    const guestToken = request.headers.get('X-Guest-Token');
    const { orderId, transactionCode } = await request.json();

    if (!orderId || !transactionCode) {
      return apiResponse.validationError('orderId and transactionCode are required');
    }

    // Get order
    const order = (await orderRepository.findById(orderId)) as any;
    if (!order) {
      return apiResponse.notFound('Order not found');
    }

    // Verify guest token matches
    if (order.guestToken && guestToken !== order.guestToken) {
      return apiResponse.forbidden('Invalid guest token');
    }

    // Update order payment status
    if (order.payment) {
      await paymentRepository.updateStatus(order.payment.id, 'COMPLETED');
      await paymentRepository.updateTransactionCode(order.payment.id, transactionCode);
    }

    // Update order status to confirmed
    await orderRepository.updateStatus(orderId, 'CONFIRMED');
    await orderRepository.updatePaymentStatus(orderId, 'COMPLETED');

    return apiResponse.success(
      { orderId, status: 'COMPLETED' },
      'Payment verified successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}

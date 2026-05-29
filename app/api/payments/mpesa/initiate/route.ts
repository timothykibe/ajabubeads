import { NextRequest } from 'next/server';
import { mpesaService } from '@/lib/services/payment.service';
import { paymentRepository } from '@/lib/db/payment.repository';
import { orderRepository } from '@/lib/db/order.repository';
import { emailService } from '@/lib/services/email.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { requireAuth } from '@/lib/utils/auth.middleware';

// POST /api/payments/mpesa/initiate
export async function POST(request: NextRequest) {
  try {
    // Try to verify authentication first (for logged-in users)
    const authHeader = request.headers.get('authorization');
    const guestToken = request.headers.get('X-Guest-Token');

    const { orderId, phoneNumber } = await request.json();

    if (!orderId || !phoneNumber) {
      return apiResponse.validationError('orderId and phoneNumber are required');
    }

    // Get order
    const order = (await orderRepository.findById(orderId)) as any;
    if (!order) {
      return apiResponse.notFound('Order not found');
    }

    // Verify authorization
    if (authHeader) {
      // For authenticated users, verify they own the order
      const auth = await requireAuth(request);
      if (!auth.authenticated || order.userId !== auth.user.userId) {
        return apiResponse.forbidden('Cannot access this order');
      }
    } else if (guestToken) {
      // For guest users, verify the guest token
      if (order.guestToken !== guestToken) {
        return apiResponse.forbidden('Invalid guest token');
      }
    } else {
      return apiResponse.unauthorized('Authentication required');
    }

    // Send STK push
    const response = await mpesaService.sendStkPush(phoneNumber, order.total, orderId);

    return apiResponse.success(
      { checkoutRequestId: response.CheckoutRequestID },
      'M-Pesa prompt sent successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}

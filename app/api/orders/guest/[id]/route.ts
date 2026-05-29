import { NextRequest } from 'next/server';
import { orderRepository } from '@/lib/db/order.repository';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';

// GET /api/orders/guest/[id]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify guest token
    const guestToken = request.headers.get('X-Guest-Token');
    const { id } = await context.params;

    if (!guestToken) {
      return apiResponse.unauthorized('Guest token is required');
    }

    // Get order
    const order = (await orderRepository.findById(id)) as any;
    if (!order) {
      return apiResponse.notFound('Order not found');
    }

    // Verify guest token matches
    if (order.guestToken !== guestToken) {
      return apiResponse.forbidden('Invalid guest token');
    }

    return apiResponse.success(order, 'Order retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

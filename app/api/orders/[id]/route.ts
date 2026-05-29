import { NextRequest } from 'next/server';
import { orderService } from '@/lib/services/order.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { requireAuth } from '@/lib/utils/auth.middleware';

// GET /api/orders/[id]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    // Verify authentication
    const auth = await requireAuth(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    const order = await orderService.getOrderDetails(id, auth.user.userId);

    return apiResponse.success(order, 'Order retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

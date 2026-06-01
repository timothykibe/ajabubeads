import { NextRequest } from 'next/server';
import { orderService } from '@/lib/services/order.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { requireAdminAuth } from '@/lib/utils/auth.middleware';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    const { id } = context.params;
    const order = await orderService.getOrderDetails(id);
    return apiResponse.success(order, 'Order details retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    const { id } = context.params;
    const body = await request.json();
    const status = body?.status;
    if (!status) {
      return apiResponse.validationError('status is required');
    }

    const updated = await orderService.updateOrderStatus(id, status);
    return apiResponse.success(updated, 'Order status updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

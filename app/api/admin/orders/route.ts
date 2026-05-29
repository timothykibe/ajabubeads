import { NextRequest } from 'next/server';
import { orderRepository } from '@/lib/db/order.repository';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { requireAdminAuth } from '@/lib/utils/auth.middleware';

// GET /api/admin/orders
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    const url = new URL(request.url);
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const take = parseInt(url.searchParams.get('take') || '10');
    const status = url.searchParams.get('status') || undefined;
    const paymentStatus = url.searchParams.get('paymentStatus') || undefined;

    const result = await orderRepository.getAll({
      skip,
      take,
      status: status as any,
      paymentStatus: paymentStatus as any,
    });

    return apiResponse.success(result, 'Orders retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

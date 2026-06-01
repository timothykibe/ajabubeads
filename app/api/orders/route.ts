import { NextRequest } from 'next/server';
import { orderService } from '@/lib/services/order.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { requireAuth } from '@/lib/utils/auth.middleware';
import { validate, createOrderSchema } from '@/lib/utils/validation';

// POST /api/orders (create order)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await requireAuth(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    const body = await request.json();

    // Validate input
    const validation = validate(createOrderSchema, body);
    if (!validation.success) {
      return apiResponse.validationError(validation.error!);
    }

    // Create order
    const order = await orderService.createOrder(
      auth.user.userId,
      validation.data.items,
      validation.data.shippingData,
      validation.data.paymentMethod || 'MPESA',
      validation.data.orderType || 'DELIVERY'
    );

    return apiResponse.created(order, 'Order created successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/orders (get user orders)
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await requireAuth(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    const url = new URL(request.url);
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const take = parseInt(url.searchParams.get('take') || '10');

    const orders = await orderService.getUserOrders(auth.user.userId, {
      skip,
      take,
    });

    return apiResponse.success(orders, 'Orders retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

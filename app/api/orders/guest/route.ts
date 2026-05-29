import { NextRequest } from 'next/server';
import { orderService } from '@/lib/services/order.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { validate, createOrderSchema } from '@/lib/utils/validation';

// POST /api/orders/guest (create order as guest)
export async function POST(request: NextRequest) {
  try {
    // Verify guest token
    const guestToken = request.headers.get('X-Guest-Token');
    if (!guestToken) {
      return apiResponse.unauthorized('Guest token is required');
    }

    const body = await request.json();

    // Validate input
    const validation = validate(createOrderSchema, body);
    if (!validation.success) {
      return apiResponse.validationError(validation.error!);
    }

    const order = await orderService.createGuestOrder(
      guestToken,
      validation.data.items,
      validation.data.shippingData,
      validation.data.paymentMethod || 'MPESA'
    );

    return apiResponse.created(order, 'Order created successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

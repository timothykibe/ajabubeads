import { NextRequest } from 'next/server';
import { cybersourceService } from '@/lib/services/payment.service';
import { paymentRepository } from '@/lib/db/payment.repository';
import { orderRepository } from '@/lib/db/order.repository';
import { emailService } from '@/lib/services/email.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { validate, processCyberSourceSchema } from '@/lib/utils/validation';

// POST /api/payments/cybersource
export async function POST(request: NextRequest) {
  try {
    const guestToken = request.headers.get('X-Guest-Token');
    const body = await request.json();

    const validation = validate(processCyberSourceSchema, body);
    if (!validation.success) {
      return apiResponse.validationError(validation.error!);
    }

    const order = (await orderRepository.findById(validation.data.orderId)) as any;
    if (!order) {
      return apiResponse.notFound('Order not found');
    }

    if (!guestToken || order.guestToken !== guestToken) {
      return apiResponse.forbidden('Invalid guest token');
    }

    const token = await cybersourceService.createPaymentToken({
      cardNumber: validation.data.cardNumber,
      expiryMonth: validation.data.expiryMonth,
      expiryYear: validation.data.expiryYear,
      cvv: validation.data.cvv,
    });

    const charge = await cybersourceService.processCharge({
      orderId: order.id,
      amount: order.total,
      currency: 'KES',
      token,
      email: order.email,
    });

    if (order.payment) {
      await paymentRepository.updateWithReference(order.payment.id, {
        status: 'COMPLETED',
        cybersourceTransactionId: charge.transactionId,
        metadata: { charge },
      });
    }

    await orderRepository.updateStatus(order.id, 'CONFIRMED');
    await orderRepository.updatePaymentStatus(order.id, 'COMPLETED');
    await emailService.sendPaymentConfirmation(order.email, order.orderNumber, charge.transactionId, order.total);

    return apiResponse.success(
      { transactionId: charge.transactionId, status: 'COMPLETED' },
      'Payment completed successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}

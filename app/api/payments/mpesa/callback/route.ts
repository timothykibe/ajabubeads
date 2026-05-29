import { NextRequest } from 'next/server';
import { mpesaService } from '@/lib/services/payment.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';

// POST /api/payments/mpesa/callback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Process the callback
    await mpesaService.processCallback(body);

    // M-Pesa expects a 200 response
    return apiResponse.success({ status: 'received' }, 'Callback processed');
  } catch (error) {
    console.error('Callback error:', error);
    return apiResponse.success({ status: 'error' }, 'Callback processed with error');
  }
}

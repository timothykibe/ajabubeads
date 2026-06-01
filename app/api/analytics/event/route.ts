import { NextRequest } from 'next/server';
import { analyticsService } from '@/lib/services/analytics.service';
import { emailService } from '@/lib/services/email.service';
import { verifyAuth } from '@/lib/utils/auth.middleware';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body?.eventType;
    const eventData = body?.eventData || null;

    if (!eventType) {
      return apiResponse.validationError('eventType is required');
    }

    const auth = await verifyAuth(request);
    const userId = auth?.userId || null;

    await analyticsService.logEvent(userId, eventType, eventData);

    if (eventType === 'kyc_request') {
      const emailBody = `A new KYC support request has been submitted:\n\n${JSON.stringify(eventData, null, 2)}`;
      await emailService.sendAdminNotification('New KYC Support Request', emailBody);
    }

    return apiResponse.success({ logged: true }, 'Event logged successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

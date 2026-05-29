import { NextRequest } from 'next/server';
import { validate, newsletterSchema } from '@/lib/utils/validation';
import { emailService } from '@/lib/services/email.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { userRepository } from '@/lib/db/user.repository';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validate(newsletterSchema, body);
    if (!validation.success) {
      return apiResponse.validationError(validation.error!);
    }

    await emailService.sendNewsletterSignup(validation.data.email);
    await userRepository.markSubscriberByEmail(validation.data.email);

    return apiResponse.success({ subscribed: true }, 'Subscribed to newsletter successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

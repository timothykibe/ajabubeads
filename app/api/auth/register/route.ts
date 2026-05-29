import { NextRequest } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { emailService } from '@/lib/services/email.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { validate, registerSchema, loginSchema } from '@/lib/utils/validation';

// POST /api/auth/register
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validate(registerSchema, body);
    if (!validation.success) {
      return apiResponse.validationError(validation.error!);
    }

    // Register user
    const result = await authService.register(validation.data);

    // Send welcome email
    await emailService.sendWelcomeEmail(result.user.email, result.user.name || 'User');

    return apiResponse.created(result, 'User registered successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

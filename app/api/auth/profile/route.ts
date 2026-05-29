import { NextRequest } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { requireAuth } from '@/lib/utils/auth.middleware';
import { validate, updateProfileSchema } from '@/lib/utils/validation';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    const profile = await authService.getUserProfile(auth.user.userId);
    return apiResponse.success(profile, 'Profile retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    const body = await request.json();
    const validation = validate(updateProfileSchema, body);
    if (!validation.success) {
      return apiResponse.validationError(validation.error!);
    }

    const updated = await authService.updateProfile(auth.user.userId, validation.data);
    return apiResponse.success(updated, 'Profile updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

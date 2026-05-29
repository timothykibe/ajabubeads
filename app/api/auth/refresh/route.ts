import { NextRequest } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const refreshToken = body?.refreshToken;
    if (!refreshToken) return apiResponse.validationError('refreshToken is required');

    const result = await authService.refreshToken(refreshToken);
    return apiResponse.success(result, 'Token refreshed');
  } catch (error) {
    return handleApiError(error);
  }
}

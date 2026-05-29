import { NextRequest } from 'next/server';
import { authService } from '@/lib/services/auth.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body || {};
    const data = await authService.login(email, password);
    return apiResponse.success(data, 'Login successful');
  } catch (error) {
    return handleApiError(error);
  }
}

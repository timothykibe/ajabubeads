import { NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/utils/auth.middleware';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';

// GET /api/admin/auth/me
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) return apiResponse.unauthorized('Invalid or missing token');

    const { userId, email, isAdmin, isSuperAdmin, name } = auth as any;

    return apiResponse.success({ id: userId, email, name, isAdmin, isSuperAdmin }, 'OK');
  } catch (error) {
    return handleApiError(error);
  }
}

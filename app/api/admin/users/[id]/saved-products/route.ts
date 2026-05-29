import { NextRequest } from 'next/server';
import { userRepository } from '@/lib/db/user.repository';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { requireAdminAuth } from '@/lib/utils/auth.middleware';

// GET /api/admin/users/[id]/saved-products - admin only
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) return auth.response;

    const { id } = await context.params;
    const saved = await userRepository.getSavedProducts(id);
    return apiResponse.success({ saved }, 'Saved products retrieved');
  } catch (error) {
    return handleApiError(error);
  }
}

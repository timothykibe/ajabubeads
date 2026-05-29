import { NextRequest } from 'next/server';
import { userRepository } from '@/lib/db/user.repository';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { requireAdminAuth } from '@/lib/utils/auth.middleware';

// PUT /api/admin/users/[id] - update roles (admin only)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
  const auth = await requireAdminAuth(request);

    const body = await request.json();
    const { isAdmin, isSuperAdmin } = body || {};

    const updated = await userRepository.update(id, { isAdmin, isSuperAdmin } as any);

    return apiResponse.success(updated, 'User updated');
  } catch (error) {
    return handleApiError(error);
  }
}

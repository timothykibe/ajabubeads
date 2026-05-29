import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/utils/auth.middleware';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { userRepository } from '@/lib/db/user.repository';

// GET /api/user/saved-products - list saved products for authenticated user
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated) return auth.response;

    const saved = await userRepository.getSavedProducts(auth.user.userId);
    // Map to friendly format
    const data = saved.map((s: any) => ({
      id: s.product.id,
      name: s.product.name,
      price: s.product.price,
      image: s.product.images?.[0] || null,
      savedAt: s.createdAt,
    }));

    return apiResponse.success({ items: data }, 'Saved products retrieved');
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/user/saved-products - add a saved product
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated) return auth.response;

    const body = await request.json();
    const productId = body?.productId;
    if (!productId) return apiResponse.validationError('productId is required');

    const created = await userRepository.addSavedProduct(auth.user.userId, productId);
    return apiResponse.success({ created }, 'Product saved');
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/user/saved-products - remove a saved product (expects JSON { productId })
export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.authenticated) return auth.response;

    const body = await request.json();
    const productId = body?.productId;
    if (!productId) return apiResponse.validationError('productId is required');

    await userRepository.removeSavedProduct(auth.user.userId, productId);
    return apiResponse.success(null, 'Product removed from saved items');
  } catch (error) {
    return handleApiError(error);
  }
}

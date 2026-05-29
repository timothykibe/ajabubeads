import { NextRequest } from 'next/server';
import { productService } from '@/lib/services/product.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { requireAdminAuth } from '@/lib/utils/auth.middleware';
import { validate, updateProductSchema } from '@/lib/utils/validation';

// PUT /api/admin/products/[id]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    // Verify admin authentication
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    const body = await request.json();

    // Validate input
    const validation = validate(updateProductSchema, body);
    if (!validation.success) {
      return apiResponse.validationError(validation.error!);
    }

    // Update product
    const product = await productService.updateProduct(id, validation.data);

    return apiResponse.success(product, 'Product updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    // Verify admin authentication
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    // Delete product
    await productService.deleteProduct(id);

    return apiResponse.success(null, 'Product deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

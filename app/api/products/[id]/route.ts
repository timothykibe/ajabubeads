import { NextRequest } from 'next/server';
import { productService } from '@/lib/services/product.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';

// GET /api/products/[id]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const product = await productService.getProduct(id);
    return apiResponse.success(product, 'Product retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

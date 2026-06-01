import { NextRequest } from 'next/server';
import { productService } from '@/lib/services/product.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const skip = Math.max(0, parseInt(url.searchParams.get('skip') || '0'));
    const take = Math.min(Math.max(1, parseInt(url.searchParams.get('take') || '12')), 100);
    const category = url.searchParams.get('category')?.trim() || undefined;
    const search = url.searchParams.get('search')?.trim().substring(0, 100) || undefined;
    const featured = url.searchParams.get('featured') === 'true';

    console.log('Product API - Query params:', {
      skip,
      take,
      category,
      search,
      featured,
    });

    const result = await productService.getAllProducts({
      skip,
      take,
      category,
      search,
      featured,
    });

    return apiResponse.success(result, 'Products retrieved successfully');
  } catch (error) {
    console.error('Product API - Error:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      error,
    });
    return handleApiError(error);
  }
}

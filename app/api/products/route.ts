import { NextRequest } from 'next/server';
import { productService } from '@/lib/services/product.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const take = parseInt(url.searchParams.get('take') || '12');
    const category = url.searchParams.get('category') || undefined;
    const search = url.searchParams.get('search') || undefined;
    const featured = url.searchParams.get('featured') === 'true';

    const result = await productService.getAllProducts({
      skip,
      take,
      category,
      search,
      featured,
    });

    return apiResponse.success(result, 'Products retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

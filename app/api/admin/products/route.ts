import { NextRequest } from 'next/server';
import { productService } from '@/lib/services/product.service';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { requireAdminAuth } from '@/lib/utils/auth.middleware';
import { validate, createProductSchema, updateProductSchema } from '@/lib/utils/validation';

// POST /api/admin/products (create product)
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    const body = await request.json();

    // Validate input
    const validation = validate(createProductSchema, body);
    if (!validation.success) {
      return apiResponse.validationError(validation.error!);
    }

    // Create product
    const product = await productService.createProduct(validation.data);

    return apiResponse.created(product, 'Product created successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/admin/products (list products)
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    const url = new URL(request.url);
    const skip = parseInt(url.searchParams.get('skip') || '0');
    const take = parseInt(url.searchParams.get('take') || '10');
    const category = url.searchParams.get('category') || undefined;
    const lowStock = url.searchParams.get('lowStock') === 'true';

    if (lowStock) {
      const products = await productService.getLowStockProducts();
      return apiResponse.success(products, 'Low stock products retrieved');
    }

    const result = await productService.getAllProducts({
      skip,
      take,
      category,
    });

    return apiResponse.success(result, 'Products retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

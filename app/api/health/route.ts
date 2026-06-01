import { prisma } from '@/lib/db/prisma';
import { apiResponse } from '@/lib/utils/api.response';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check database connection
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const orderCount = await prisma.order.count();

    // Get sample product
    const sampleProduct = await prisma.product.findFirst({
      where: { isActive: true },
    });

    return apiResponse.success(
      {
        status: 'healthy',
        database: {
          connected: true,
          userCount,
          productCount,
          orderCount,
          sampleProduct: sampleProduct
            ? {
                id: sampleProduct.id,
                name: sampleProduct.name,
                price: sampleProduct.price,
                isActive: sampleProduct.isActive,
              }
            : null,
        },
      },
      'Health check successful'
    );
  } catch (error) {
    console.error('Health check error:', error);
    return apiResponse.serverError(
      `Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

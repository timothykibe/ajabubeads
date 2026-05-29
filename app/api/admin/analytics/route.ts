import { NextRequest } from 'next/server';
import { analyticsService } from '@/lib/services/analytics.service';
import { orderRepository } from '@/lib/db/order.repository';
import { paymentRepository } from '@/lib/db/payment.repository';
import { apiResponse, handleApiError } from '@/lib/utils/api.response';
import { requireAdminAuth } from '@/lib/utils/auth.middleware';

// GET /api/admin/analytics
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const auth = await requireAdminAuth(request);
    if (!auth.authenticated) {
      return auth.response;
    }

    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30');
    const type = url.searchParams.get('type') || 'dashboard';

    let result;

    if (type === 'dashboard') {
      // Get dashboard metrics
      const [metrics, sales, payment] = await Promise.all([
        analyticsService.getDashboardMetrics(days),
        orderRepository.getSalesSummary(
          new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        ),
        paymentRepository.getSummary(
          new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        ),
      ]);

      result = {
        metrics,
        sales,
        payments: payment,
      };
    } else if (type === 'conversion') {
      result = await analyticsService.getConversionData(days);
    } else if (type === 'traffic') {
      result = await analyticsService.getTrafficBySource(days);
    } else if (type === 'topProducts') {
      result = await analyticsService.getTopProducts(10, days);
    } else {
      result = await analyticsService.getDashboardMetrics(days);
    }

    return apiResponse.success(result, 'Analytics retrieved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

import { analyticsRepository } from '../db/analytics.repository';

export const analyticsService = {
  // Log event
  async logEvent(userId: string | null, eventType: string, eventData?: any): Promise<void> {
    await analyticsRepository.logEvent(userId, eventType, eventData);
  },

  // Get dashboard metrics
  async getDashboardMetrics(days: number = 30): Promise<any> {
    return analyticsRepository.getDashboardMetrics(days);
  },

  // Get page views summary
  async getPageViewsSummary(days: number = 30): Promise<any> {
    return analyticsRepository.getPageViewsSummary(days);
  },

  // Get conversion data
  async getConversionData(days: number = 30): Promise<any> {
    return analyticsRepository.getConversionData(days);
  },

  // Get top products
  async getTopProducts(limit: number = 10, days: number = 30): Promise<any> {
    return analyticsRepository.getTopProducts(limit, days);
  },

  // Record page view
  async recordPageView(pagePath: string): Promise<void> {
    await analyticsRepository.recordPageView(pagePath);
  },

  // Get traffic by source
  async getTrafficBySource(days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const pages = await analyticsRepository.getPageViewsSummary(days);
    
    return {
      pages,
      totalViews: pages.reduce((sum: number, p: any) => sum + p.views, 0),
    };
  },
};

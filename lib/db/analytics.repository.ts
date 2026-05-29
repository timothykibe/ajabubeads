import { prisma } from './prisma';

export const analyticsRepository = {
  // Log analytics event
  async logEvent(userId: string | null, eventType: string, eventData?: any) {
    return prisma.analyticsEvent.create({
      data: {
        userId: userId || undefined,
        eventType,
        eventData,
      },
    });
  },

  // Get page views summary
  async getPageViewsSummary(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return prisma.pageAnalytics.findMany({
      where: {
        date: {
          gte: startDate,
        },
      },
      orderBy: { views: 'desc' },
      take: 10,
    });
  },

  // Get product analytics
  async getProductAnalytics(productId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return prisma.productAnalytics.findMany({
      where: {
        productId,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'desc' },
    });
  },

  // Get top products by views
  async getTopProducts(limit: number = 10, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return prisma.productAnalytics.findMany({
      where: {
        date: {
          gte: startDate,
        },
      },
      orderBy: { views: 'desc' },
      take: limit,
      include: { product: true },
    });
  },

  // Get conversion data
  async getConversionData(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const pageViews = await prisma.pageAnalytics.aggregate({
      where: {
        date: {
          gte: startDate,
        },
      },
      _sum: {
        views: true,
      },
    });

    const addToCart = await prisma.analyticsEvent.count({
      where: {
        eventType: 'add_to_cart',
        createdAt: {
          gte: startDate,
        },
      },
    });

    const purchases = await prisma.analyticsEvent.count({
      where: {
        eventType: 'purchase',
        createdAt: {
          gte: startDate,
        },
      },
    });

    return {
      pageViews: pageViews._sum.views || 0,
      addToCart,
      purchases,
      conversionRate: pageViews._sum.views ? (purchases / pageViews._sum.views) * 100 : 0,
    };
  },

  // Record page view
  async recordPageView(pagePath: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.pageAnalytics.upsert({
      where: {
        pagePath_date: {
          pagePath,
          date: today,
        },
      },
      create: {
        pagePath,
        date: today,
        views: 1,
        visitors: 1,
      },
      update: {
        views: { increment: 1 },
      },
    });
  },

  // Record product view
  async recordProductView(productId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.productAnalytics.upsert({
      where: {
        productId_date: {
          productId,
          date: today,
        },
      },
      create: {
        productId,
        date: today,
        views: 1,
        clicks: 0,
        purchases: 0,
        revenue: 0,
      },
      update: {
        views: { increment: 1 },
      },
    });
  },

  // Get dashboard metrics
  async getDashboardMetrics(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [pageViews, uniqueVisitors, events, chatClicks, subscriberCount] = await Promise.all([
      prisma.pageAnalytics.aggregate({
        where: {
          date: {
            gte: startDate,
          },
        },
        _sum: { views: true },
      }),
      prisma.analyticsEvent.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        distinct: ['userId'],
      }),
      prisma.analyticsEvent.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
      prisma.analyticsEvent.count({
        where: {
          eventType: 'chat_button_click',
          createdAt: {
            gte: startDate,
          },
        },
      }),
      prisma.user.count({
        where: {
          isSubscribed: true,
        },
      }),
    ]);

    return {
      pageViews: pageViews._sum.views || 0,
      uniqueVisitors: uniqueVisitors.length,
      totalEvents: events.length,
      avgEventsPerVisitor: uniqueVisitors.length > 0 ? events.length / uniqueVisitors.length : 0,
      chatClicks,
      subscriberCount,
    };
  },
};

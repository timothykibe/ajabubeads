// Export all repositories
export * from './product.repository';
export * from './user.repository';
export * from './order.repository';
export * from './payment.repository';
export * from './analytics.repository';

// Re-export Prisma client for convenience
export { prisma, default } from './prisma';

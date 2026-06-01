import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export const productRepository = {
  // Get all products with pagination and filtering
  async findAll(options: {
    skip?: number;
    take?: number;
    category?: string;
    search?: string;
    featured?: boolean;
  } = {}) {
    const skip = Math.max(0, parseInt(String(options.skip || 0)));
    const take = Math.min(Math.max(1, parseInt(String(options.take || 12))), 100);
    const category = options.category?.trim() || undefined;
    const search = options.search?.trim().substring(0, 100) || undefined;
    const { featured } = options;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(category && { category: { equals: category } }),
      ...(featured && { isFeatured: true }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    try {
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.count({ where }),
      ]);

      return { products, total, pages: Math.ceil(total / take) };
    } catch (error) {
      console.error('Product repository error:', {
        skip,
        take,
        category,
        search,
        featured,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  },

  // Get single product by ID
  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        reviews: { where: { isApproved: true } },
      },
    });
  },

  // Get product by slug
  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        reviews: { where: { isApproved: true } },
      },
    });
  },

  // Create product (admin)
  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({ data });
  },

  // Update product (admin)
  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data,
    });
  },

  // Delete product (admin)
  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  },

  // Get featured products
  async getFeatured(limit: number = 6) {
    return prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  },

  // Update stock
  async updateStock(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: {
        stock: { decrement: quantity },
      },
    });
  },

  // Get low stock products (admin)
  async getLowStock(threshold?: number) {
    return prisma.product.findMany({
      where: {
        stock: {
          lte: threshold || 10,
        },
      },
      orderBy: { stock: 'asc' },
    });
  },
};

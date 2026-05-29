import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export const blogRepository = {
  // Create blog
  async create(data: Prisma.BlogCreateInput) {
    return prisma.blog.create({
      data: {
        ...data,
        publishedAt: new Date(),
      },
    });
  },

  // Get all blogs (public)
  async getAll(options: { skip?: number; take?: number } = {}) {
    const { skip = 0, take = 10 } = options;

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where: { isPublished: true },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blog.count({ where: { isPublished: true } }),
    ]);

    return { blogs, total };
  },

  // Get all blogs (admin - includes unpublished)
  async getAllAdmin(options: { skip?: number; take?: number } = {}) {
    const { skip = 0, take = 10 } = options;

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blog.count(),
    ]);

    return { blogs, total };
  },

  // Get blog by ID
  async findById(id: string) {
    return prisma.blog.findUnique({
      where: { id },
    });
  },

  // Get blog by slug
  async findBySlug(slug: string) {
    return prisma.blog.findUnique({
      where: { slug },
    });
  },

  // Search blogs
  async search(query: string, options: { skip?: number; take?: number } = {}) {
    const { skip = 0, take = 10 } = options;

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } },
          ],
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blog.count({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } },
          ],
        },
      }),
    ]);

    return { blogs, total };
  },

  // Get blogs by tag
  async findByTag(tag: string, options: { skip?: number; take?: number } = {}) {
    const { skip = 0, take = 10 } = options;

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where: {
          isPublished: true,
          tags: { has: tag },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blog.count({
        where: {
          isPublished: true,
          tags: { has: tag },
        },
      }),
    ]);

    return { blogs, total };
  },

  // Update blog
  async update(id: string, data: Prisma.BlogUpdateInput) {
    return prisma.blog.update({
      where: { id },
      data,
    });
  },

  // Increment views
  async incrementViews(id: string) {
    return prisma.blog.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  },

  // Delete blog
  async delete(id: string) {
    return prisma.blog.delete({
      where: { id },
    });
  },

  // Get trending blogs (most viewed)
  async getTrending(limit: number = 5) {
    return prisma.blog.findMany({
      where: { isPublished: true },
      orderBy: { views: 'desc' },
      take: limit,
    });
  },

  // Get recent blogs
  async getRecent(limit: number = 5) {
    return prisma.blog.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  // Get all tags
  async getAllTags() {
    const blogs = await prisma.blog.findMany({
      where: { isPublished: true },
      select: { tags: true },
    });

    const tagsSet = new Set<string>();
    blogs.forEach((blog) => {
      blog.tags.forEach((tag) => tagsSet.add(tag));
    });

    return Array.from(tagsSet).sort();
  },
};

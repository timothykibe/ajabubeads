import { blogRepository } from '../db/blog.repository';
import { Prisma } from '@prisma/client';

export const blogService = {
  // Create blog
  async createBlog(data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featuredImage?: string;
    author?: string;
    tags?: string[];
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  }) {
    try {
      // Check if slug already exists
      const existing = await blogRepository.findBySlug(data.slug);
      if (existing) {
        throw new Error('Blog slug already exists');
      }

      // Generate slug if not provided
      const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

      return await blogRepository.create({
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage,
        author: data.author || 'Ajabu Beads',
        tags: data.tags || [],
        metaTitle: data.metaTitle || data.title,
        metaDescription: data.metaDescription || data.excerpt,
        metaKeywords: data.metaKeywords,
        isPublished: true, // Auto-approve
      });
    } catch (error) {
      console.error('Blog creation error:', error);
      throw error;
    }
  },

  // Get all blogs with pagination
  async getAllBlogs(options: { skip?: number; take?: number } = {}) {
    return blogRepository.getAll(options);
  },

  // Get all blogs (admin)
  async getAllBlogsAdmin(options: { skip?: number; take?: number } = {}) {
    return blogRepository.getAllAdmin(options);
  },

  // Get blog by ID
  async getBlog(id: string) {
    const blog = await blogRepository.findById(id);
    if (!blog) {
      throw new Error('Blog not found');
    }

    // Increment views
    await blogRepository.incrementViews(id);

    return blog;
  },

  // Get blog by slug
  async getBlogBySlug(slug: string) {
    const blog = await blogRepository.findBySlug(slug);
    if (!blog) {
      throw new Error('Blog not found');
    }

    // Increment views
    await blogRepository.incrementViews(blog.id);

    return blog;
  },

  // Search blogs
  async searchBlogs(query: string, options: { skip?: number; take?: number } = {}) {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    return blogRepository.search(query, options);
  },

  // Get blogs by tag
  async getBlogsByTag(tag: string, options: { skip?: number; take?: number } = {}) {
    if (!tag || tag.trim().length === 0) {
      throw new Error('Tag is required');
    }

    return blogRepository.findByTag(tag, options);
  },

  // Update blog
  async updateBlog(id: string, data: Partial<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    author: string;
    tags: string[];
    isPublished: boolean;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  }>) {
    try {
      const blog = await blogRepository.findById(id);
      if (!blog) {
        throw new Error('Blog not found');
      }

      // If slug is being changed, check if new slug exists
      if (data.slug && data.slug !== blog.slug) {
        const existing = await blogRepository.findBySlug(data.slug);
        if (existing) {
          throw new Error('Blog slug already exists');
        }
      }

      return await blogRepository.update(id, data);
    } catch (error) {
      console.error('Blog update error:', error);
      throw error;
    }
  },

  // Delete blog
  async deleteBlog(id: string) {
    try {
      const blog = await blogRepository.findById(id);
      if (!blog) {
        throw new Error('Blog not found');
      }

      return await blogRepository.delete(id);
    } catch (error) {
      console.error('Blog deletion error:', error);
      throw error;
    }
  },

  // Get trending blogs
  async getTrendingBlogs(limit: number = 5) {
    return blogRepository.getTrending(limit);
  },

  // Get recent blogs
  async getRecentBlogs(limit: number = 5) {
    return blogRepository.getRecent(limit);
  },

  // Get all tags
  async getAllTags() {
    return blogRepository.getAllTags();
  },
};

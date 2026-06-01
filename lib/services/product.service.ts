import { productRepository } from '../db/product.repository';
import { analyticsRepository } from '../db/analytics.repository';
import { Prisma } from '@prisma/client';

export const productService = {
  // Get all products with pagination
  async getAllProducts(options: {
    skip?: number;
    take?: number;
    category?: string;
    search?: string;
    featured?: boolean;
  } = {}) {
    return productRepository.findAll(options);
  },

  // Get single product
  async getProduct(id: string): Promise<any> {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    // Log product view
    await analyticsRepository.recordProductView(id);

    return product;
  },

  // Get product by slug
  async getProductBySlug(slug: string): Promise<any> {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new Error('Product not found');
    }

    // Log product view
    await analyticsRepository.recordProductView(product.id);

    return product;
  },

  // Get featured products
  async getFeaturedProducts(limit: number = 6): Promise<any> {
    return productRepository.getFeatured(limit);
  },

  // Create product (admin)
  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    costPrice?: number;
    sku: string;
    category: string;
    optionLabelA?: string;
    optionLabelB?: string;
    colors?: string[];
    sizes?: string[];
    stock: number;
    images?: string[];
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
  }): Promise<any> {
    // Check if SKU exists
    const existing = await productRepository.findAll({ search: data.sku });
    if (existing.products.length > 0) {
      throw new Error('Product SKU already exists');
    }

    return productRepository.create({
      name: data.name,
      description: data.description,
      price: data.price,
      costPrice: data.costPrice,
      sku: data.sku,
      category: data.category,
      optionLabelA: data.optionLabelA,
      optionLabelB: data.optionLabelB,
      colors: data.colors || [],
      sizes: data.sizes || [],
      stock: data.stock,
      images: data.images || [],
      slug: data.slug,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      inStock: data.stock > 0,
    } as any);
  },

  // Update product (admin)
  async updateProduct(id: string, data: Partial<{
    name: string;
    description: string;
    price: number;
    costPrice: number;
    category: string;
    optionLabelA: string;
    optionLabelB: string;
    colors: string[];
    sizes: string[];
    stock: number;
    images: string[];
    slug: string;
    metaTitle: string;
    metaDescription: string;
    isFeatured: boolean;
    isActive: boolean;
  }>): Promise<any> {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    return productRepository.update(id, {
      ...data,
      inStock: (data.stock || product.stock) > 0,
    } as any);
  },

  // Delete product (admin)
  async deleteProduct(id: string): Promise<void> {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }

    await productRepository.delete(id);
  },

  // Get low stock products (admin)
  async getLowStockProducts(threshold?: number): Promise<any> {
    return productRepository.getLowStock(threshold);
  },

  // Get product analytics (admin)
  async getProductAnalytics(productId: string, days: number = 30): Promise<any> {
    return analyticsRepository.getProductAnalytics(productId, days);
  },

  // Get top selling products (admin)
  async getTopProducts(limit: number = 10, days: number = 30): Promise<any> {
    return analyticsRepository.getTopProducts(limit, days);
  },

  // Search products
  async searchProducts(query: string, limit: number = 10): Promise<any> {
    const result = await productRepository.findAll({
      search: query,
      take: limit,
    });
    return result.products;
  },

  // Get products by category
  async getProductsByCategory(category: string, options: { skip?: number; take?: number } = {}): Promise<any> {
    return productRepository.findAll({
      category,
      ...options,
    });
  },

  // Bulk update stock (admin)
  async bulkUpdateStock(updates: Array<{ productId: string; stock: number }>): Promise<void> {
    for (const update of updates) {
      await productRepository.update(update.productId, {
        stock: update.stock,
        inStock: update.stock > 0,
      });
    }
  },

  // Export products (admin)
  async exportProducts(): Promise<any[]> {
    const result = await productRepository.findAll({ take: 10000 });
    return result.products;
  },
};

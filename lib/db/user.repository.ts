import { prisma } from './prisma';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const userRepository = {
  // Create user
  async create(data: {
    email: string;
    password: string;
    name?: string;
    phone?: string;
    image?: string;
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        image: data.image,
        isAdmin: data.isAdmin || false,
        isSuperAdmin: data.isSuperAdmin || false,
      },
    });
  },

  // Find user by email
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  },

  // Find user by ID
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
      },
    });
  },

  // Update user
  async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  // Verify password
  async verifyPassword(hashedPassword: string, plainPassword: string) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  // Add address
  async addAddress(userId: string, addressData: Prisma.AddressUncheckedCreateInput) {
    return prisma.address.create({
      data: {
        ...addressData,
        userId,
      },
    });
  },

  // Get user addresses
  async getAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
    });
  },

  // Delete address
  async deleteAddress(addressId: string) {
    return prisma.address.delete({
      where: { id: addressId },
    });
  },

  // Get all users (admin)
  async getAllUsers(options: { skip?: number; take?: number } = {}) {
    const { skip = 0, take = 10 } = options;
    const [users, total] = await Promise.all([
      (prisma as any).user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          savedProducts: { include: { product: true } },
          _count: {
            select: {
              orders: true,
              savedProducts: true,
            },
          },
        },
      }),
      prisma.user.count(),
    ]);
    return { users, total };
  },

  async markSubscriberByEmail(email: string) {
    return prisma.user.updateMany({
      where: { email: email.toLowerCase() },
      data: { isSubscribed: true },
    });
  },

  // Saved products (wishlist)
  async addSavedProduct(userId: string, productId: string) {
    return (prisma as any).savedProduct.create({
      data: {
        userId,
        productId,
      },
    });
  },

  async removeSavedProduct(userId: string, productId: string) {
    return (prisma as any).savedProduct.deleteMany({
      where: { userId, productId },
    });
  },

  async getSavedProducts(userId: string) {
    return (prisma as any).savedProduct.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
  },
};

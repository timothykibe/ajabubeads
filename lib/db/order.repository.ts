import { prisma } from './prisma';
import { Prisma, OrderStatus, PaymentStatus } from '@prisma/client';

export const orderRepository = {
  // Create order
  async create(data: Prisma.OrderCreateInput) {
    return prisma.order.create({
      data,
      include: { items: true, payment: true },
    });
  },

  // Create guest order
  async createGuestOrder(data: Prisma.OrderCreateInput & { guestToken: string }) {
    return prisma.order.create({
      data,
      include: { items: true, payment: true },
    });
  },

  // Get order by guest token
  async findByGuestToken(guestToken: string) {
    return prisma.order.findUnique({
      where: { guestToken },
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
      },
    });
  },
  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
      },
    });
  },

  // Update order
  async update(id: string, data: Prisma.OrderUpdateInput) {
    return prisma.order.update({
      where: { id },
      data,
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
      },
    });
  },

  // Get order by order number
  async findByOrderNumber(orderNumber: string) {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
      },
    });
  },

  // Get user orders
  async getUserOrders(userId: string, options: { skip?: number; take?: number } = {}) {
    const { skip = 0, take = 10 } = options;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        include: {
          items: {
            include: { product: true },
          },
          payment: true,
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { userId } }),
    ]);
    return { orders, total };
  },

  // Update order status
  async updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { status },
    });
  },

  // Update payment status
  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
    return prisma.order.update({
      where: { id },
      data: { paymentStatus },
    });
  },

  // Get all orders (admin)
  async getAll(options: {
    skip?: number;
    take?: number;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
  } = {}) {
    const { skip = 0, take = 10, status, paymentStatus } = options;

    const where: Prisma.OrderWhereInput = {
      ...(status && { status }),
      ...(paymentStatus && { paymentStatus }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: { product: true },
          },
          user: true,
          payment: true,
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total };
  },

  // Get sales summary (admin)
  async getSalesSummary(startDate?: Date, endDate?: Date) {
    const where: Prisma.OrderWhereInput = {
      status: { in: ['CONFIRMED', 'SHIPPED', 'DELIVERED'] },
      ...(startDate && { createdAt: { gte: startDate } }),
      ...(endDate && { createdAt: { lte: endDate } }),
    };

    const orders = await prisma.order.findMany({
      where,
      include: { items: true },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalItems = orders.reduce((sum, order) => sum + order.items.length, 0);

    return {
      totalRevenue,
      totalOrders,
      totalItems,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  },

  // Add order item
  async addItem(orderId: string, item: Omit<Prisma.OrderItemUncheckedCreateInput, 'orderId'>) {
    // Ensure we don't accidentally pass an orderId property twice when
    // spreading item. Strip any orderId from the incoming item then set it
    // explicitly.
    const { orderId: _maybeOrderId, ...itemWithoutOrderId } = item as any;
    return prisma.orderItem.create({
      data: {
        ...itemWithoutOrderId,
        orderId,
      },
    });
  },
};

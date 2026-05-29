import { prisma } from './prisma';
import { PaymentStatus, PaymentMethod, Prisma } from '@prisma/client';

export const paymentRepository = {
  // Create payment
  async create(data: Prisma.PaymentCreateInput) {
    return prisma.payment.create({
      data,
      include: { order: true },
    });
  },

  // Find payment by ID
  async findById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
      include: { order: true },
    });
  },

  // Find payment by order ID
  async findByOrderId(orderId: string) {
    return prisma.payment.findUnique({
      where: { orderId },
      include: { order: true },
    });
  },

  // Find payment by M-Pesa code
  async findByMpesaCode(mpesaCode: string) {
    return prisma.payment.findFirst({
      where: { mpesaCode },
      include: { order: true },
    });
  },

  // Find payment by CyberSource transaction ID
  async findByCybersourceTransactionId(transactionId: string) {
    return prisma.payment.findFirst({
      where: { cybersourceTransactionId: transactionId },
      include: { order: true },
    });
  },

  // Update payment status
  async updateStatus(
    id: string,
    status: PaymentStatus,
    metadata?: Record<string, any>
  ) {
    return prisma.payment.update({
      where: { id },
      data: {
        status,
        metadata,
      },
      include: { order: true },
    });
  },

  // Update transaction code
  async updateTransactionCode(id: string, mpesaCode: string) {
    return prisma.payment.update({
      where: { id },
      data: { mpesaCode },
      include: { order: true },
    });
  },

  // Update payment with gateway reference
  async updateWithReference(
    id: string,
    data: {
      status?: PaymentStatus;
      method?: PaymentMethod;
      mpesaCode?: string;
      cybersourceTransactionId?: string;
      failureReason?: string;
      metadata?: Record<string, any>;
    }
  ) {
    return prisma.payment.update({
      where: { id },
      data,
      include: { order: true },
    });
  },

  // Get payments (admin)
  async getAll(options: {
    skip?: number;
    take?: number;
    status?: PaymentStatus;
    method?: PaymentMethod;
  } = {}) {
    const { skip = 0, take = 10, status, method } = options;

    const where: Prisma.PaymentWhereInput = {
      ...(status && { status }),
      ...(method && { method }),
    };

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: { order: true },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payment.count({ where }),
    ]);

    return { payments, total };
  },

  // Get payment summary (admin)
  async getSummary(startDate?: Date, endDate?: Date) {
    const where: Prisma.PaymentWhereInput = {
      status: 'COMPLETED',
      ...(startDate && { createdAt: { gte: startDate } }),
      ...(endDate && { createdAt: { lte: endDate } }),
    };

    const payments = await prisma.payment.findMany({ where });

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalCount = payments.length;

    const byMethod = payments.reduce((acc, p) => {
      acc[p.method] = (acc[p.method] || 0) + p.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAmount,
      totalCount,
      avgAmount: totalCount > 0 ? totalAmount / totalCount : 0,
      byMethod,
    };
  },

  // Get failed payments (admin)
  async getFailedPayments(limit: number = 10) {
    return prisma.payment.findMany({
      where: { status: 'FAILED' },
      include: { order: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  },
};

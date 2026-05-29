import { orderRepository } from '../db/order.repository';
import { paymentRepository } from '../db/payment.repository';
import { productRepository } from '../db/product.repository';
import { userRepository } from '../db/user.repository';
import { Prisma, PaymentMethod } from '@prisma/client';
import { emailService } from './email.service';

export const orderService = {
  // Create order from cart
  async createOrder(
    userId: string,
    cartItems: Array<{ productId: string; quantity: number; color?: string; size?: string }>,
    shippingData: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      postalCode: string;
      country?: string;
    }
  ): Promise<any> {
    try {
      // Validate cart items and get prices
      let subtotal = 0;
      const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];

      for (const item of cartItems) {
        const product = await productRepository.findById(item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        subtotal += product.price * item.quantity;
        orderItems.push({
          product: { connect: { id: product.id } },
          quantity: item.quantity,
          price: product.price,
          color: item.color,
          size: item.size,
        });
      }

      // Calculate shipping and tax
      const shipping = subtotal > 5000 ? 0 : 500;
      const tax = Math.round(subtotal * 0.16); // 16% VAT
      const total = subtotal + shipping + tax;

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // Create order
      const order = await orderRepository.create({
        orderNumber,
        user: { connect: { id: userId } },
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        email: shippingData.email,
        phone: shippingData.phone,
        address: shippingData.address,
        city: shippingData.city,
        postalCode: shippingData.postalCode,
        country: shippingData.country || 'Kenya',
        subtotal,
        tax,
        shipping,
        total,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: 'MPESA', // Default to M-Pesa
        items: {
          create: orderItems,
        },
      });

      // Create payment record
      const payment = await paymentRepository.create({
        order: { connect: { id: order.id } },
        method: 'MPESA',
        amount: total,
        currency: 'KES',
        status: 'PENDING',
      });

      // Update product stocks
      for (const item of cartItems) {
        await productRepository.updateStock(item.productId, item.quantity);
      }

      return {
        ...order,
        payment,
      };
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  },

  // Create order as guest (no user required)
  async createGuestOrder(
    guestToken: string,
    cartItems: Array<{ productId: string; quantity: number; color?: string; size?: string }>,
    shippingData: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      postalCode: string;
      country?: string;
    },
    paymentMethod: PaymentMethod = 'MPESA'
  ): Promise<any> {
    try {
      let subtotal = 0;
      const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];
      const emailItems: Array<{ product: string; quantity: number; price: number }> = [];

      for (const item of cartItems) {
        const product = await productRepository.findById(item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        subtotal += product.price * item.quantity;
        orderItems.push({
          product: { connect: { id: product.id } },
          quantity: item.quantity,
          price: product.price,
          color: item.color,
          size: item.size,
        });

        emailItems.push({
          product: product.name,
          quantity: item.quantity,
          price: product.price,
        });
      }

      const shipping = subtotal > 5000 ? 0 : 500;
      const tax = Math.round(subtotal * 0.16);
      const total = subtotal + shipping + tax;
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      const order = await orderRepository.createGuestOrder({
        orderNumber,
        guestToken,
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        email: shippingData.email,
        phone: shippingData.phone,
        address: shippingData.address,
        city: shippingData.city,
        postalCode: shippingData.postalCode,
        country: shippingData.country || 'Kenya',
        subtotal,
        tax,
        shipping,
        total,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod,
        items: {
          create: orderItems,
        },
      });

      const payment = await paymentRepository.create({
        order: { connect: { id: order.id } },
        method: paymentMethod,
        amount: total,
        currency: 'KES',
        status: 'PENDING',
      });

      for (const item of cartItems) {
        await productRepository.updateStock(item.productId, item.quantity);
      }

      await emailService.sendOrderConfirmation(
        order.email,
        order.orderNumber,
        total,
        emailItems
      );

      return {
        ...order,
        payment,
      };
    } catch (error) {
      console.error('Guest order creation error:', error);
      throw error;
    }
  },

  // Update payment method
  async updatePaymentMethod(
    orderId: string,
    paymentMethod: PaymentMethod
  ): Promise<void> {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    await orderRepository.update(orderId, { paymentMethod });
    if (order.payment) {
      await paymentRepository.updateWithReference(order.payment.id, { method: paymentMethod });
    }
  },

  // Get order details
  async getOrderDetails(orderId: string, userId?: string): Promise<any> {
    const order = await orderRepository.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // Check authorization
    if (userId && order.userId !== userId) {
      throw new Error('Unauthorized');
    }

    return order;
  },

  // Get user orders
  async getUserOrders(
    userId: string,
    options: { skip?: number; take?: number } = {}
  ): Promise<any> {
    return orderRepository.getUserOrders(userId, options);
  },

  // Update order status (admin)
  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const updatedOrder = await orderRepository.updateStatus(
      orderId,
      status as any
    );

    // Send status update email
    await emailService.sendOrderStatusUpdate(
      order.email,
      order.orderNumber,
      status
    );

    return updatedOrder;
  },

  // Cancel order
  async cancelOrder(orderId: string): Promise<void> {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status !== 'PENDING') {
      throw new Error('Can only cancel pending orders');
    }

    // Restore product stocks
    for (const item of order.items) {
      await productRepository.updateStock(item.productId, -item.quantity);
    }

    // Update order status
    await orderRepository.updateStatus(orderId, 'CANCELLED');

    // Refund payment if completed
    if (order.payment && order.payment.status === 'COMPLETED') {
      await paymentRepository.updateStatus(order.payment.id, 'REFUNDED');
    }
  },

  // Generate invoice
  async generateInvoice(orderId: string): Promise<Buffer> {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // This would generate a PDF invoice
    // For now, returning a simple text representation
    const invoiceData = `
AJABU BEADS INVOICE
==================
Order #: ${order.orderNumber}
Date: ${new Date(order.createdAt).toLocaleDateString()}

BILLING ADDRESS:
${order.firstName} ${order.lastName}
${order.address}
${order.city}, ${order.postalCode}
${order.country}

ITEMS:
${order.items.map((item: any) => `${item.product.name} x${item.quantity} = KES ${item.price * item.quantity}`).join('\n')}

Subtotal: KES ${order.subtotal}
Tax (16%): KES ${order.tax}
Shipping: KES ${order.shipping}
TOTAL: KES ${order.total}

Payment Status: ${order.paymentStatus}
Order Status: ${order.status}
    `;

    return Buffer.from(invoiceData);
  },

  // Get sales analytics (admin)
  async getSalesAnalytics(
    startDate?: Date,
    endDate?: Date
  ): Promise<any> {
    return orderRepository.getSalesSummary(startDate, endDate);
  },
};

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@ajabubeads.com';

export const emailService = {
  // Send order confirmation email
  async sendOrderConfirmation(
    email: string,
    orderNumber: string,
    orderTotal: number,
    items: any[]
  ): Promise<void> {
    try {
      const itemsHtml = items
        .map(
          (item) => `
        <tr>
          <td>${item.product.name}</td>
          <td>${item.quantity}</td>
          <td>KES ${item.price}</td>
          <td>KES ${item.price * item.quantity}</td>
        </tr>
      `
        )
        .join('');

      const html = `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <table border="1" cellpadding="10">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <p><strong>Order Total:</strong> KES ${orderTotal}</p>
        <p>You will receive a payment prompt on your phone. Please complete the payment.</p>
        <p>Thank you for shopping with Ajabu Beads!</p>
      `;

      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `Order Confirmation - ${orderNumber}`,
        html,
      });
    } catch (error) {
      console.error('Email sending error:', error);
      // Don't throw - email failures shouldn't block order creation
    }
  },

  // Send payment confirmation email
  async sendPaymentConfirmation(
    email: string,
    orderNumber: string,
    mpesaCode: string,
    amount: number
  ): Promise<void> {
    try {
      const html = `
        <h1>Payment Confirmed</h1>
        <p>Your payment has been received successfully.</p>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>M-Pesa Reference:</strong> ${mpesaCode}</p>
        <p><strong>Amount:</strong> KES ${amount}</p>
        <p>Your order will be processed shortly. You will receive a shipping update via email.</p>
        <p>Thank you for shopping with Ajabu Beads!</p>
      `;

      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `Payment Confirmed - ${orderNumber}`,
        html,
      });
    } catch (error) {
      console.error('Email sending error:', error);
    }
  },

  // Send order status update email
  async sendOrderStatusUpdate(
    email: string,
    orderNumber: string,
    status: string
  ): Promise<void> {
    try {
      const statusMessages: Record<string, string> = {
        CONFIRMED: 'Your order has been confirmed and is being prepared.',
        PROCESSING: 'Your order is being processed.',
        SHIPPED: 'Your order has been shipped!',
        DELIVERED: 'Your order has been delivered.',
        CANCELLED: 'Your order has been cancelled.',
      };

      const message = statusMessages[status] || `Your order status is now: ${status}`;

      const html = `
        <h1>Order Update</h1>
        <p><strong>Order Number:</strong> ${orderNumber}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p>${message}</p>
        <p>Thank you for shopping with Ajabu Beads!</p>
      `;

      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `Order Update - ${orderNumber}`,
        html,
      });
    } catch (error) {
      console.error('Email sending error:', error);
    }
  },

  async sendNewsletterSignup(email: string): Promise<void> {
    try {
      const html = `
        <h1>Newsletter Signup</h1>
        <p>Thank you for subscribing to the Ajabu Beads newsletter!</p>
        <p>You'll now receive updates on new products, promotions, and events.</p>
      `;

      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Welcome to the Ajabu Beads Newsletter',
        html,
      });
    } catch (error) {
      console.error('Email sending error:', error);
    }
  },

  // Send password reset email
  async sendPasswordReset(email: string, resetLink: string): Promise<void> {
    try {
      const html = `
        <h1>Password Reset</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `;

      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Password Reset Request',
        html,
      });
    } catch (error) {
      console.error('Email sending error:', error);
    }
  },

  // Send welcome email
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    try {
      const html = `
        <h1>Welcome to Ajabu Beads!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for creating an account with us. We're excited to have you!</p>
        <p>Browse our collection of handcrafted beads and jewelry.</p>
        <p>Use code WELCOME10 for 10% off your first order!</p>
        <p>Happy shopping!</p>
      `;

      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: 'Welcome to Ajabu Beads',
        html,
      });
    } catch (error) {
      console.error('Email sending error:', error);
    }
  },

  // Send admin notification email
  async sendAdminNotification(subject: string, message: string): Promise<void> {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@ajabubeads.com';

      await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `[Admin] ${subject}`,
        html: `<p>${message}</p>`,
      });
    } catch (error) {
      console.error('Email sending error:', error);
    }
  },
};

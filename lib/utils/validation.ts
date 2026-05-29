import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  costPrice: z.number().optional(),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  stock: z.number().min(0, 'Stock must be non-negative'),
  images: z.array(z.string()).optional(),
  slug: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

// Order schemas
export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      color: z.string().optional(),
      size: z.string().optional(),
    })
  ),
  shippingData: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().optional(),
  }),
  paymentMethod: z.enum(['MPESA', 'CYBERSOURCE']).optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const settingsSchema = z.object({
  mpesaConsumerKey: z.string().optional(),
  mpesaConsumerSecret: z.string().optional(),
  mpesaShortcode: z.string().optional(),
  mpesaPasskey: z.string().optional(),
  mpesaCallbackUrl: z.string().url('Invalid callback URL').optional(),
  cybersourceMerchantKeyId: z.string().optional(),
  cybersourceMerchantSecretKey: z.string().optional(),
  cybersourceWebhookSecret: z.string().optional(),
});

// Payment schemas
export const initiatePaymentSchema = z.object({
  orderId: z.string(),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  paymentMethod: z.enum(['MPESA', 'CYBERSOURCE']),
});

export const processCyberSourceSchema = z.object({
  orderId: z.string(),
  cardNumber: z.string().regex(/^\d{13,19}$/, 'Invalid card number'),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, 'Invalid expiry month'),
  expiryYear: z.string().regex(/^\d{2}$/, 'Invalid expiry year'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),
});

// Validate function
export const validate = (schema: z.ZodSchema, data: any) => {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error: any) {
    return {
      success: false,
      error: error.errors?.[0]?.message || 'Validation error',
    };
  }
};

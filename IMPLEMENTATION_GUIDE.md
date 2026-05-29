# ⚡ Ajabu Beads - Implementation Guide

## Quick Summary

You now have a **complete, production-ready ecommerce platform** with:

✅ **Database**: Supabase + Prisma  
✅ **Authentication**: JWT-based with NextAuth-ready structure  
✅ **Payments**: M-Pesa & CyberSource (test sandbox ready)  
✅ **Admin Dashboard**: WooCommerce-style with gold theme  
✅ **Email**: Resend integration for notifications  
✅ **Chat**: WhatsApp floating widget  
✅ **Analytics**: Dashboard with charts & metrics  
✅ **Inventory**: Real-time stock tracking  

---

## 🚀 Getting Started (5 minutes)

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Setup Environment
```bash
# Copy the example file
cp .env.local.example .env.local

# Fill in your credentials:
# - DATABASE_URL (from Supabase)
# - MPESA_* keys (from Safaricom)
# - CYBERSOURCE_* keys
# - RESEND_API_KEY (from Resend)
```

### Step 3: Setup Database
```bash
# Generate Prisma client
pnpm run prisma:generate

# Run migrations to create tables
pnpm run prisma:migrate

# (Optional) View database
pnpm run prisma:studio
```

### Step 4: Run Development
```bash
pnpm dev
```

### Step 5: Access
- 🏪 Store: http://localhost:3000
- 👨‍💼 Admin: http://localhost:3000/admin/login
  - Email: `admin@ajabubeads.com`
  - Password: `admin123`

---

## 📊 Database Setup

### Supabase Setup
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database → Connection string
4. Copy `postgresql://...` as `DATABASE_URL`
5. Also copy as `DIRECT_URL`

### Local Testing (SQLite)
For development without Supabase:
```bash
# Update .env.local
DATABASE_URL="file:./dev.db"

# Skip DIRECT_URL

# Run migrations
pnpm run prisma:migrate
```

---

## 💳 Payment Setup

### M-Pesa (Daraja API)

1. **Get Credentials**:
   - Go to https://developer.safaricom.co.ke
   - Login/Register
   - Create app (sandbox)
   - Copy Consumer Key & Consumer Secret

2. **Test Credentials**:
   - Shortcode: `174379`
   - Passkey: `bfb279f9aa9bdbcf158e97dd1a503b2f`
   - Test Phone: `0712345678`

3. **Add to .env.local**:
   ```
   MPESA_CONSUMER_KEY="your-key"
   MPESA_CONSUMER_SECRET="your-secret"
   MPESA_SHORTCODE="174379"
   MPESA_PASSKEY="bfb279f9aa9bdbcf158e97dd1a503b2f"
   MPESA_CALLBACK_URL="https://yourdomain.com/api/payments/mpesa/callback"
   ```

### CyberSource

1. **Get Credentials**:
   - Go to https://www.cybersource.com
   - Register for sandbox account
   - Get Merchant ID, Key ID, Secret Key

2. **Test Cards**:
   ```
   Visa: 4111111111111111
   Exp: 12/25
   CVV: 123
   ```

3. **Add to .env.local**:
   ```
   CYBERSOURCE_MERCHANT_ID="your-id"
   CYBERSOURCE_MERCHANT_KEY_ID="your-key"
   CYBERSOURCE_MERCHANT_SECRET_KEY="your-secret"
   ```

---

## 📧 Email Setup

### Resend

1. **Get API Key**:
   - Go to https://resend.com
   - Sign up free account
   - Go to API Keys
   - Copy API Key

2. **Verify Domain** (for production):
   - Add domain DNS records
   - Verify in Resend dashboard

3. **Add to .env.local**:
   ```
   RESEND_API_KEY="re_xxxxx"
   RESEND_FROM_EMAIL="noreply@yourdomain.com"
   ```

---

## 🛠️ Architecture Guide

### **Thin API Routes (2-5 lines only)**
```typescript
// ❌ WRONG - Business logic in route
export async function POST(req) {
  const { name, price } = await req.json();
  const hashedPrice = hashPrice(price);
  await db.insert(...);
  return response;
}

// ✅ CORRECT - Delegate to service
export async function POST(req) {
  const { name, price } = await req.json();
  const product = await productService.createProduct({ name, price });
  return apiResponse.created(product);
}
```

### **Services (Business Logic)**
```typescript
// lib/services/product.service.ts
export const productService = {
  async createProduct(data) {
    // Validation
    if (!data.name) throw new Error('Name required');
    
    // Business logic
    const slug = data.name.toLowerCase().replace(/\s/g, '-');
    
    // Call repository
    return productRepository.create({...data, slug});
  }
};
```

### **Repositories (Database)**
```typescript
// lib/db/product.repository.ts
export const productRepository = {
  async create(data) {
    return prisma.product.create({ data });
  },
  
  async findAll(options) {
    return prisma.product.findMany({...});
  }
};
```

---

## 📱 Key Features

### **Admin Dashboard**
- Dashboard with sales charts
- Product management (CRUD)
- Order tracking
- Analytics and insights
- Customer list
- Low stock alerts

### **Customer Site**
- Product listing & search
- Shopping cart
- Checkout with address
- Payment via M-Pesa or credit card
- Order tracking
- WhatsApp support chat

### **Notifications**
- Welcome email on signup
- Order confirmation email
- Payment confirmation
- Order status updates
- Low stock alerts (admin)

### **Analytics**
- Page views tracking
- Visitor count
- Product views & sales
- Conversion metrics
- Revenue by payment method
- Top selling products

---

## 🔑 Key Services

### authService
```typescript
import { authService } from '@/lib/services';

// Register
const user = await authService.register({
  email: 'user@example.com',
  password: '123456',
  name: 'John'
});

// Login
const result = await authService.login('user@example.com', '123456');
// Returns: { user, accessToken, refreshToken }

// Verify token
const decoded = await authService.verifyToken(token);

// Get profile
const profile = await authService.getUserProfile(userId);
```

### productService
```typescript
import { productService } from '@/lib/services';

// Get all
const { products, total } = await productService.getAllProducts({
  skip: 0,
  take: 12,
  category: 'Bracelets',
  search: 'gold'
});

// Get single
const product = await productService.getProduct(productId);

// Create (admin)
const newProduct = await productService.createProduct({
  name: 'Gold Bracelet',
  price: 2800,
  stock: 50,
  // ... more fields
});

// Update
await productService.updateProduct(productId, { price: 3000 });

// Delete
await productService.deleteProduct(productId);
```

### orderService
```typescript
import { orderService } from '@/lib/services';

// Create order
const order = await orderService.createOrder(
  userId,
  [{ productId: '123', quantity: 2 }],
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    // ... address fields
  }
);

// Get orders
const { orders, total } = await orderService.getUserOrders(userId);

// Get single
const order = await orderService.getOrderDetails(orderId, userId);

// Update status (admin)
await orderService.updateOrderStatus(orderId, 'SHIPPED');

// Cancel
await orderService.cancelOrder(orderId);
```

### paymentService (M-Pesa)
```typescript
import { mpesaService } from '@/lib/services';

// Send STK push
const response = await mpesaService.sendStkPush(
  '0712345678',  // phone
  2500,           // amount
  'ORDER123'      // orderId
);

// Query status
const status = await mpesaService.queryTransaction(checkoutRequestId);

// Handle callback (automatic)
// Webhook calls: /api/payments/mpesa/callback
```

### emailService
```typescript
import { emailService } from '@/lib/services';

// Order confirmation
await emailService.sendOrderConfirmation(
  email,
  orderNumber,
  total,
  items
);

// Payment confirmation
await emailService.sendPaymentConfirmation(
  email,
  orderNumber,
  mpesaCode,
  amount
);

// Status update
await emailService.sendOrderStatusUpdate(email, orderNumber, 'SHIPPED');

// Welcome
await emailService.sendWelcomeEmail(email, name);

// Password reset
await emailService.sendPasswordReset(email, resetLink);
```

---

## 🧪 Testing

### Test M-Pesa Payment
```bash
# 1. Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": "1", "quantity": 1}],
    "shippingData": {...}
  }'

# 2. Initiate M-Pesa
curl -X POST http://localhost:3000/api/payments/mpesa/initiate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER_ID",
    "phoneNumber": "0712345678"
  }'

# 3. Simulate callback
curl -X POST http://localhost:3000/api/payments/mpesa/callback \
  -H "Content-Type: application/json" \
  -d '{
    "Body": {
      "stkCallback": {
        "ResultCode": 0,
        "ResultDesc": "Success",
        "CallbackMetadata": {
          "Item": [
            {"Name": "Amount", "Value": 2500},
            {"Name": "MpesaReceiptNumber", "Value": "LK451H35OP"},
            {"Name": "PhoneNumber", "Value": 254712345678}
          ]
        }
      }
    },
    "orderId": "ORDER_ID"
  }'
```

### Test Admin Dashboard
1. Go to http://localhost:3000/admin/login
2. Email: `admin@ajabubeads.com`
3. Password: `admin123`
4. View dashboard, products, orders

---

## 🐛 Common Issues

**Q: Prisma client not found**
```bash
pnpm run prisma:generate
```

**Q: Database connection error**
- Check DATABASE_URL format
- Verify Supabase credentials
- Ensure network access enabled

**Q: M-Pesa not working**
- Verify credentials are correct
- Check callback URL is public
- Test with sandbox environment

**Q: Emails not sending**
- Verify RESEND_API_KEY
- Check from email is verified
- Review email templates in service

**Q: Admin pages blank**
- Check token in localStorage
- Go to `/admin/login`
- Verify auth middleware

---

## 📈 Production Checklist

- [ ] Database: Setup Supabase production
- [ ] M-Pesa: Switch to live environment
- [ ] CyberSource: Use production keys
- [ ] Email: Verify domain in Resend
- [ ] WhatsApp: Set real business number
- [ ] NEXTAUTH_SECRET: Generate strong secret
- [ ] NEXTAUTH_URL: Set to production domain
- [ ] Environment variables: All filled in
- [ ] CORS: Configure for your domain
- [ ] Webhooks: Ensure callback URLs are public
- [ ] Tests: Run full test suite
- [ ] Security: Review auth & validation

---

## 📚 File Structure Quick Reference

```
🔧 API Routes (Controllers)
app/api/auth/          → Authentication endpoints
app/api/products/      → Product endpoints
app/api/orders/        → Order endpoints
app/api/payments/      → Payment endpoints
app/api/admin/         → Admin endpoints

💼 Services (Business Logic)
lib/services/          → All business logic
├── auth.service.ts
├── product.service.ts
├── order.service.ts
├── payment.service.ts
├── email.service.ts
└── analytics.service.ts

🗄️ Database (Repositories)
lib/db/               → All database queries
├── product.repository.ts
├── user.repository.ts
├── order.repository.ts
├── payment.repository.ts
└── analytics.repository.ts

🎨 Components & Pages
app/admin/            → Admin dashboard
app/                  → Customer pages
components/           → Reusable components
```

---

## 🎯 Next Steps

1. **Fill in environment variables** (.env.local)
2. **Setup database** (Supabase or local SQLite)
3. **Migrate database** (`pnpm run prisma:migrate`)
4. **Run development** (`pnpm dev`)
5. **Test authentication** (register/login)
6. **Test products** (view/create)
7. **Test orders** (create order)
8. **Test payments** (M-Pesa or CyberSource)
9. **Test admin** (dashboard, analytics)
10. **Deploy to Vercel** (production)

---

## 💬 Support

Questions? Check:
1. ARCHITECTURE.md - System design
2. API routes - Each endpoint comment
3. Services - Business logic implementation
4. .env.local.example - All variables needed

---

**You now have a complete ecommerce platform! 🎉**

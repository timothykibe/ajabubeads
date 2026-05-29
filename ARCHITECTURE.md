# Ajabu Beads - Complete Ecommerce System Architecture

## 🎯 System Overview

This is a **production-grade ecommerce platform** built with Next.js 16, Supabase (PostgreSQL), and Prisma, featuring:

- ✅ Complete admin dashboard with WooCommerce-style UI
- ✅ M-Pesa payment integration (test sandbox)
- ✅ CyberSource payment integration (test sandbox)
- ✅ Email notifications with Resend
- ✅ WhatsApp floating chat widget
- ✅ Advanced analytics & reporting
- ✅ Inventory management
- ✅ Order management system
- ✅ Customer authentication
- ✅ Clean, scalable architecture

---

## 📁 Architecture Overview

### **Folder Structure**

```
app/
├── api/                          # THIN ROUTING LAYER (Controllers)
│   ├── auth/
│   │   ├── register/route.ts     # User registration
│   │   └── login/route.ts        # User login
│   ├── products/                 # Product endpoints
│   ├── orders/                   # Order endpoints
│   ├── payments/
│   │   ├── mpesa/
│   │   │   ├── initiate/         # STK Push
│   │   │   └── callback/         # Payment callback
│   │   └── cybersource/          # Credit card processing
│   └── admin/                    # Admin management endpoints
│       ├── products/
│       ├── orders/
│       └── analytics/
├── admin/                         # Admin dashboard pages
│   ├── layout.tsx                # Admin layout with sidebar
│   ├── page.tsx                  # Dashboard with analytics
│   ├── products/
│   ├── orders/
│   └── customers/
└── (customer)/                   # Customer-facing pages

lib/
├── db/                           # DATABASE LAYER (Repositories)
│   ├── prisma.ts                 # Prisma client singleton
│   ├── product.repository.ts     # Product queries
│   ├── user.repository.ts        # User queries
│   ├── order.repository.ts       # Order queries
│   ├── payment.repository.ts     # Payment queries
│   └── analytics.repository.ts   # Analytics queries
├── services/                     # BUSINESS LOGIC LAYER
│   ├── auth.service.ts           # Authentication logic
│   ├── product.service.ts        # Product operations
│   ├── order.service.ts          # Order processing
│   ├── payment.service.ts        # M-Pesa & CyberSource
│   ├── email.service.ts          # Email notifications
│   ├── analytics.service.ts      # Analytics logic
│   └── jwt.service.ts            # JWT token management
└── utils/
    ├── api.response.ts           # API response formatting
    ├── auth.middleware.ts        # Auth middleware
    └── validation.ts             # Input validation (Zod)

components/
├── admin/                        # Admin-specific components
├── ui/                          # Radix UI components
└── whatsapp-widget.tsx          # WhatsApp floating chat

prisma/
└── schema.prisma                # Database schema

```

---

## 🏗️ Architecture Principles

### **1. Thin API Routes (Controllers)**
- API routes in `/app/api/` are **request routers only**
- 2-5 lines per route: validate → call service → return response
- **No business logic** in routes

### **2. Services Layer**
- Contains all **business logic**
- Orchestrates operations (e.g., `createOrder` updates inventory + creates payment + sends email)
- Reusable across API routes, webhooks, scheduled tasks

### **3. Repositories Layer**
- All **database queries** live here
- Clean separation from business logic
- Easy to test and refactor

### **4. Middleware**
- Authentication checking (`verifyAuth`, `requireAuth`, `requireAdminAuth`)
- Input validation using Zod schemas
- Error handling with consistent API responses

---

## 🛠️ Tech Stack

```
Frontend:
├── Next.js 16
├── React 19
├── Radix UI Components
├── TailwindCSS
├── Recharts (Analytics)
└── Lucide Icons

Backend:
├── Next.js API Routes
├── Prisma ORM
├── Supabase (PostgreSQL)
└── JWT Authentication

Payments:
├── M-Pesa Daraja API (Test Sandbox)
└── CyberSource (Test Sandbox)

Services:
├── Resend (Email)
├── PostHog (Analytics)
└── Crisp/Custom WhatsApp

Database:
└── PostgreSQL (via Supabase)
```

---

## 🚀 Setup Instructions

### **1. Environment Variables**

Copy `.env.local.example` to `.env.local` and fill in:

```bash
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="xxxxx"

# M-Pesa (Sandbox)
MPESA_CONSUMER_KEY="your-key"
MPESA_CONSUMER_SECRET="your-secret"
MPESA_PASSKEY="bfb279f9aa9bdbcf158e97dd1a503b2f"

# CyberSource (Sandbox)
CYBERSOURCE_MERCHANT_ID="your-id"
CYBERSOURCE_MERCHANT_KEY_ID="your-key"
CYBERSOURCE_MERCHANT_SECRET_KEY="your-secret"

# Email
RESEND_API_KEY="your-key"
RESEND_FROM_EMAIL="noreply@ajabubeads.com"

# Auth
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### **2. Database Setup**

```bash
# Install dependencies
pnpm install

# Setup Prisma
pnpm run prisma:generate

# Run migrations
pnpm run prisma:migrate

# View database
pnpm run prisma:studio
```

### **3. Run Development Server**

```bash
pnpm dev
```

Access:
- 🏪 Customer site: http://localhost:3000
- 👨‍💼 Admin: http://localhost:3000/admin
- 📚 API docs: Check `/app/api/` routes

---

## 📊 API Endpoints

### **Authentication**
```
POST   /api/auth/register           Register new user
POST   /api/auth/login              Login user
POST   /api/auth/refresh            Refresh JWT token
GET    /api/auth/profile            Get user profile
```

### **Products**
```
GET    /api/products                List all products (paginated)
GET    /api/products/[id]           Get product details
GET    /api/products?featured=true  Get featured products
GET    /api/products?search=...     Search products
```

### **Orders**
```
POST   /api/orders                  Create order
GET    /api/orders                  Get user orders
GET    /api/orders/[id]             Get order details
```

### **Payments**
```
POST   /api/payments/mpesa/initiate Send STK push
POST   /api/payments/mpesa/callback M-Pesa callback handler
POST   /api/payments/cybersource    Process credit card
```

### **Admin**
```
GET    /api/admin/products          List all products
POST   /api/admin/products          Create product
PUT    /api/admin/products/[id]     Update product
DELETE /api/admin/products/[id]     Delete product

GET    /api/admin/orders            List all orders (filterable)
GET    /api/admin/analytics         Dashboard analytics
```

---

## 💳 Payment Integration

### **M-Pesa (Daraja API)**

**Flow:**
1. Customer initiates checkout
2. Backend calls `/api/payments/mpesa/initiate` with phone number
3. M-Pesa sends STK prompt to customer's phone
4. Customer enters PIN
5. M-Pesa sends callback to `/api/payments/mpesa/callback`
6. Order status updated + email sent

**Test Mode:**
- Phone: 0712345678
- Amount: Any value
- Code: MZD1234567 (simulated)

### **CyberSource**

**Flow:**
1. Customer enters card details on checkout
2. Frontend tokenizes card via CyberSource Flex API
3. Backend calls `/api/payments/cybersource` with token
4. CyberSource processes charge
5. Payment status updated

**Test Cards:**
- Visa: 4111111111111111
- Expiry: Any future date
- CVV: Any 3 digits

---

## 📈 Admin Dashboard Features

### **Dashboard**
- Revenue metrics (KES)
- Order count & trend
- Visitor analytics
- Payment method breakdown
- Sales charts

### **Products**
- Browse all products
- Create/Edit/Delete products
- Real-time inventory tracking
- Low stock alerts
- Stock value calculation

### **Orders**
- View all orders with status
- Filter by status/payment
- Track order lifecycle
- Revenue summary
- Customer details

### **Customers**
- Customer list
- Order history per customer
- Contact information
- Purchase analytics

---

## 📧 Email Notifications

Automated emails for:
- ✅ Account registration (welcome email)
- ✅ Order confirmation
- ✅ Payment confirmation
- ✅ Order status updates
- ✅ Password reset
- ✅ Admin notifications

**Setup with Resend:**
1. Get API key from resend.com
2. Add to `.env.local`
3. Emails sent automatically via services

---

## 💬 WhatsApp Widget

Floating chat widget on customer site:
- Quick reply options
- Redirect to WhatsApp
- Custom message template
- Mobile-friendly

**Setup:**
1. Add WhatsApp number to `.env.local`
2. Component automatically renders
3. User clicks → WhatsApp opens

---

## 🔐 Security

**Features:**
- Password hashing with bcryptjs
- JWT token authentication (24h expiry)
- Refresh token rotation (7d expiry)
- Input validation (Zod schemas)
- Admin role verification
- CORS headers (adjust as needed)
- Webhook signature verification

---

## 🧪 Testing

### **M-Pesa Payment Flow**
```
1. Create order via /api/orders
2. Call /api/payments/mpesa/initiate with test phone
3. Simulate callback to /api/payments/mpesa/callback
4. Verify payment status updated
5. Check email sent
```

### **Product Management**
```
1. Create product via /api/admin/products
2. View in dashboard
3. Update stock
4. Verify low stock alert
5. Delete product
```

---

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Admin sidebar collapses on mobile
- ✅ Tables scroll on small screens
- ✅ Optimized for all devices

---

## 🚀 Deployment

### **Vercel (Recommended)**
```bash
git push origin main
```
Automatic deployment with environment variables

### **Self-Hosted**
```bash
pnpm build
pnpm start
```

---

## 📝 Database Schema

### **Core Tables**
- **User**: Customer accounts
- **Product**: Product catalog
- **Order**: Customer orders
- **OrderItem**: Items in orders
- **Payment**: Payment records
- **Address**: Shipping addresses
- **Review**: Product reviews
- **AnalyticsEvent**: Event tracking
- **ProductAnalytics**: Product metrics
- **PageAnalytics**: Page views

---

## 🆘 Troubleshooting

**Issue**: Prisma client not generating
```bash
pnpm run prisma:generate
```

**Issue**: Database connection failing
- Check DATABASE_URL format
- Verify Supabase credentials
- Ensure network access enabled

**Issue**: M-Pesa payment failing
- Verify API keys correct
- Check callback URL is accessible
- Review test sandbox settings

**Issue**: Emails not sending
- Verify Resend API key
- Check FROM email domain verified
- Review email templates in service

---

## 📚 Additional Resources

- Prisma Docs: https://www.prisma.io/docs/
- M-Pesa API: https://developer.safaricom.co.ke/
- CyberSource: https://www.cybersource.com/
- Supabase: https://supabase.com/
- NextAuth.js: https://next-auth.js.org/

---

## 📞 Support

For issues or questions:
1. Check error logs: `pnpm dev`
2. Review API response format
3. Verify environment variables
4. Check service implementation
5. Test with curl or Postman

---

**Built with ❤️ for Ajabu Beads**

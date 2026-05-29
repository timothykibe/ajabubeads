# 🧪 Ajabu Beads - Testing Guide

## Quick Test Commands

### 1. User Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "phone": "0712345678"
  }'

# Response:
{
  "success": true,
  "data": {
    "user": {"id": "...", "email": "user@example.com", ...},
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 2. User Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Save the accessToken for authenticated requests
```

### 3. List Products
```bash
curl http://localhost:3000/api/products?skip=0&take=12&category=Bracelets

# Response:
{
  "success": true,
  "data": {
    "products": [...],
    "total": 45,
    "pages": 4
  }
}
```

### 4. Get Single Product
```bash
curl http://localhost:3000/api/products/product-id

# Response:
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Gold Bracelet",
    "price": 2800,
    "stock": 50,
    ...
  }
}
```

### 5. Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "product-id",
        "quantity": 2,
        "color": "Gold",
        "size": "M"
      }
    ],
    "shippingData": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "0712345678",
      "address": "123 Main St",
      "city": "Nairobi",
      "postalCode": "00100",
      "country": "Kenya"
    }
  }'

# Response:
{
  "success": true,
  "data": {
    "id": "order-id",
    "orderNumber": "ORD-1234567890-ABC12",
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "total": 5600,
    "items": [...],
    "payment": {...}
  }
}
```

### 6. Initiate M-Pesa Payment
```bash
curl -X POST http://localhost:3000/api/payments/mpesa/initiate \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order-id",
    "phoneNumber": "0712345678"
  }'

# Response:
{
  "success": true,
  "data": {
    "checkoutRequestId": "ws_CO_DMZ_123456..."
  }
}
```

### 7. Simulate M-Pesa Callback (for testing)
```bash
curl -X POST http://localhost:3000/api/payments/mpesa/callback \
  -H "Content-Type: application/json" \
  -d '{
    "Body": {
      "stkCallback": {
        "ResultCode": 0,
        "ResultDesc": "Success",
        "CallbackMetadata": {
          "Item": [
            {"Name": "Amount", "Value": 5600},
            {"Name": "MpesaReceiptNumber", "Value": "LK451H35OP"},
            {"Name": "TransactionDate", "Value": 20231025120000},
            {"Name": "PhoneNumber", "Value": 254712345678}
          ]
        }
      }
    },
    "orderId": "order-id"
  }'

# Response:
{
  "success": true,
  "data": {"status": "received"}
}
```

### 8. Admin - List Products
```bash
curl http://localhost:3000/api/admin/products \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Response:
{
  "success": true,
  "data": {
    "products": [...],
    "total": 50
  }
}
```

### 9. Admin - Create Product
```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Bracelet",
    "description": "Beautiful beaded bracelet",
    "price": 3500,
    "costPrice": 1500,
    "sku": "NEW-BRAC-001",
    "category": "Bracelets",
    "stock": 100,
    "colors": ["Gold", "Silver"],
    "sizes": ["S", "M", "L"],
    "slug": "new-bracelet",
    "metaTitle": "New Bracelet - Ajabu Beads",
    "metaDescription": "Beautiful new bracelet"
  }'

# Response:
{
  "success": true,
  "data": {
    "id": "new-product-id",
    "name": "New Bracelet",
    ...
  }
}
```

### 10. Admin - Update Product
```bash
curl -X PUT http://localhost:3000/api/admin/products/product-id \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 4000,
    "stock": 75,
    "isFeatured": true
  }'
```

### 11. Admin - Delete Product
```bash
curl -X DELETE http://localhost:3000/api/admin/products/product-id \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Response:
{
  "success": true,
  "data": null
}
```

### 12. Admin - Get Orders
```bash
curl "http://localhost:3000/api/admin/orders?status=PENDING&skip=0&take=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Response:
{
  "success": true,
  "data": {
    "orders": [...],
    "total": 5
  }
}
```

### 13. Admin - Get Analytics
```bash
curl "http://localhost:3000/api/admin/analytics?type=dashboard&days=30" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Response:
{
  "success": true,
  "data": {
    "metrics": {
      "pageViews": 1500,
      "uniqueVisitors": 450,
      "totalEvents": 3200,
      "avgEventsPerVisitor": 7.1
    },
    "sales": {
      "totalRevenue": 125000,
      "totalOrders": 25,
      "totalItems": 62,
      "avgOrderValue": 5000
    },
    "payments": {
      "totalAmount": 125000,
      "totalCount": 25,
      "avgAmount": 5000,
      "byMethod": {"MPESA": 75000, "CYBERSOURCE": 50000}
    }
  }
}
```

---

## Testing Scenarios

### Scenario 1: Complete Purchase with M-Pesa

**Steps:**
1. Register user
2. Get access token from login
3. Create order with cart items
4. Initiate M-Pesa payment with phone
5. Simulate callback with success
6. Verify order status changed to CONFIRMED
7. Check email sent

**Expected Results:**
- Order created with PENDING status
- Payment created with PENDING status
- M-Pesa prompt initiated
- After callback: Order status = CONFIRMED, Payment status = COMPLETED
- Email notification sent to customer

---

### Scenario 2: Product Management

**Steps:**
1. Login as admin
2. Create new product
3. Verify product in list
4. Update product price
5. Delete product
6. Verify product removed

**Expected Results:**
- Product created successfully
- Product visible in list
- Price updated
- Product deleted
- Product no longer in list

---

### Scenario 3: Low Stock Alert

**Steps:**
1. Create product with stock = 5
2. Get low stock products
3. Create orders reducing stock
4. Verify low stock alert triggers

**Expected Results:**
- Product shows in low stock list
- Stock decreases with orders
- Alert shows when stock < 10

---

## Postman Collection

### Import Setup
1. Open Postman
2. Create new collection "Ajabu Beads"
3. Create environment with variables:
   - `base_url`: http://localhost:3000
   - `access_token`: (set after login)
   - `admin_token`: (set after admin login)
   - `order_id`: (set after order creation)

### Requests to Add
```
GET   {{base_url}}/api/products
POST  {{base_url}}/api/auth/register
POST  {{base_url}}/api/auth/login
POST  {{base_url}}/api/orders
GET   {{base_url}}/api/orders
POST  {{base_url}}/api/payments/mpesa/initiate
GET   {{base_url}}/api/admin/products
POST  {{base_url}}/api/admin/products
PUT   {{base_url}}/api/admin/products/:id
DELETE {{base_url}}/api/admin/products/:id
GET   {{base_url}}/api/admin/orders
GET   {{base_url}}/api/admin/analytics
```

---

## Browser Testing

### Admin Dashboard
1. Go to http://localhost:3000/admin/login
2. Enter: `admin@ajabubeads.com` / `admin123`
3. Test dashboard features:
   - View analytics charts
   - View product list
   - Create new product
   - View orders
   - Filter orders

### Customer Site
1. Go to http://localhost:3000
2. Browse products
3. Click on product details
4. Add to cart
5. Go to checkout
6. Enter shipping info
7. Select payment method (M-Pesa)
8. Submit order

---

## Error Testing

### Invalid Email
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "password123"
  }'

# Expected: 422 Unprocessable Entity
{
  "success": false,
  "error": "Invalid email address"
}
```

### Missing Required Field
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'

# Expected: 422 Unprocessable Entity
{
  "success": false,
  "error": "Password must be at least 6 characters"
}
```

### Unauthorized Access
```bash
curl http://localhost:3000/api/admin/products \
  -H "Authorization: Bearer invalid_token"

# Expected: 401 Unauthorized
{
  "success": false,
  "error": "Invalid or missing token"
}
```

### Not Found
```bash
curl http://localhost:3000/api/products/nonexistent-id

# Expected: 404 Not Found
{
  "success": false,
  "error": "Product not found"
}
```

---

## Database Testing

### Check Data
```bash
# Using Prisma Studio
pnpm run prisma:studio

# Then visit: http://localhost:5555
# View all tables and data
```

### Reset Database
```bash
# Drop and recreate
pnpm run prisma:migrate -- --name reset

# Warning: This deletes all data!
```

---

## Email Testing

### Check Emails Sent
1. Go to Resend dashboard
2. View "Emails" section
3. Check:
   - Welcome emails sent on registration
   - Order confirmation emails
   - Payment confirmation emails
   - Status update emails

### Test Email Content
Verify all emails contain:
- ✅ Correct order/customer info
- ✅ Proper formatting
- ✅ All required data
- ✅ Professional appearance

---

## Performance Testing

### Load Testing
```bash
# Using Apache Bench
ab -n 100 -c 10 http://localhost:3000/api/products

# Using wrk
wrk -t12 -c400 -d30s http://localhost:3000/api/products
```

### Response Time
- Product list: < 100ms
- Product detail: < 100ms
- Create order: < 500ms
- Payment initiate: < 1000ms (API call to M-Pesa)

---

## Checklist Before Launch

- [ ] User registration working
- [ ] User login working
- [ ] Product listing working
- [ ] Product search/filter working
- [ ] Create order working
- [ ] M-Pesa payment working
- [ ] CyberSource payment working
- [ ] Email notifications working
- [ ] Admin login working
- [ ] Admin dashboard loading
- [ ] Product CRUD working
- [ ] Order list working
- [ ] Analytics showing data
- [ ] WhatsApp widget showing
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Database migrations successful
- [ ] Environment variables set
- [ ] Security headers present

---

## Troubleshooting Test Failures

### API Returns 500 Error
1. Check terminal for error logs
2. Verify environment variables
3. Verify database connection
4. Check service implementation

### Email Not Sending
1. Verify RESEND_API_KEY in .env
2. Check email in Resend dashboard
3. Review email service code
4. Check error logs

### Admin Dashboard Blank
1. Login again
2. Check localStorage token
3. Verify admin authentication
4. Check browser console

### M-Pesa Not Working
1. Verify API keys correct
2. Check test phone format
3. Verify callback URL accessible
4. Check server logs

---

**Now you're ready to test! 🚀**

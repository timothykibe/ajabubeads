# Ajabu Beads E-Commerce Website

A beautiful, mobile-friendly e-commerce platform for handcrafted African and Indian beads and bracelets with M-Pesa checkout simulation.

## 🌟 Features

### Core Features
- **Responsive Design**: Fully mobile-optimized with desktop enhancements
- **Product Catalog**: Browse 11 handcrafted beaded bracelets with detailed descriptions
- **Shopping Cart**: Add/remove items, adjust quantities with localStorage persistence
- **Checkout Flow**: Multi-step checkout with shipping and payment information
- **M-Pesa Simulation**: Realistic payment flow with M-Pesa prompt and confirmation
- **Order Confirmation**: Complete order tracking and confirmation page

### Pages & Sections
1. **Home Page** (`/`)
   - Hero section with call-to-action
   - Featured products grid
   - Value proposition section
   - About section
   - Newsletter subscription

2. **Shop Page** (`/shop`)
   - Full product catalog (11 items)
   - Filter by category and price range
   - Sort options (featured, price, rating)
   - Responsive grid layout

3. **Product Details** (`/product/[id]`)
   - Detailed product images and descriptions
   - Color variants
   - Quantity selector
   - Customer ratings and reviews
   - Related products
   - Trust badges (shipping, returns, security)

4. **Shopping Cart** (`/cart`)
   - View all items
   - Adjust quantities
   - Remove items
   - Real-time order summary
   - Promo code input
   - Checkout button

5. **Checkout** (`/checkout`)
   - **Step 1: Shipping Information**
     - Full name, email, phone, address
     - City, postal code, country
   - **Step 2: Payment (M-Pesa)**
     - Phone number input
     - M-Pesa prompt simulation
     - Transaction code verification
   - **Step 3: Confirmation**
     - Order success message
     - Order ID and details
     - Shipping timeline

6. **Order Confirmation** (`/order-confirmation`)
   - Detailed order status
   - Next steps timeline
   - Contact information
   - Return policy info

7. **About** (`/about`)
   - Brand story
   - Core values
   - Commitment to artisans

8. **Contact** (`/contact`)
   - Contact form
   - Phone, email, physical address
   - Business hours
   - FAQ section

## 🎨 Design System

### Color Palette (From Logo)
- **Primary**: Golden/Amber (#B8860B) - Main accent and buttons
- **Secondary**: Light Beige/Cream - Subtle backgrounds
- **Foreground**: Deep Brown/Black - Text
- **Muted**: Light grays - Borders and secondary elements
- **Accent**: Coral/Warm tones - Highlights

### Typography
- **Headings**: Serif font (elegant, traditional feel)
- **Body**: Sans-serif (clean, readable)
- **Spacing**: Uses Tailwind's spacing scale

### Key Design Features
- Elegant serif typography for headings
- Warm, earthy color palette inspired by African beads
- Mobile-first responsive design
- Smooth transitions and hover effects
- Professional product photography
- Clear visual hierarchy

## 📱 Mobile Experience

- Fully responsive navigation with hamburger menu
- Touch-friendly buttons and inputs
- Optimized images for fast loading
- Stacked layout on mobile, multi-column on desktop
- Mobile-optimized forms

## 🛒 Shopping Flow

1. **Browse Products**
   - Home page featured section
   - Shop page with filters
   - Product detail pages

2. **Add to Cart**
   - Click "Add to Cart" on product cards
   - Select quantity on product detail page
   - Cart count updates in header
   - Items persist in localStorage

3. **View Cart**
   - `/cart` shows all items
   - Adjust quantities or remove items
   - See real-time totals (subtotal, shipping, tax)

4. **Checkout**
   - Fill shipping information
   - Choose M-Pesa payment
   - Enter phone number
   - Receive simulated M-Pesa prompt
   - Enter confirmation code
   - Order confirmation with tracking

## 💾 Data Persistence

- **Cart Storage**: Uses localStorage with key `ajabuCart`
- **Cart Data Structure**: Array of items with id, name, price, image, quantity, etc.
- **Auto-save**: Cart updates immediately when items added/removed

## 🎯 Product Data

11 handcrafted beaded bracelets with:
- Unique names (Harmony Gold, Serengeti, Ujumbe, etc.)
- Detailed descriptions
- Price range: KES 2,200 - 5,200
- Ratings: 4.5-5 stars
- High review counts (87-203 reviews)
- Multiple color variants
- High-quality product images

## 🚀 Getting Started

### Installation
```bash
# Install dependencies (automatic in v0)
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Environment
- No environment variables required
- Runs with mock data and localStorage
- M-Pesa integration is simulated (not real)

## 📝 Key Components

### Header (`/components/header.tsx`)
- Sticky navigation with logo
- Mobile hamburger menu
- Cart icon with item count
- Search icon (placeholder)

### Footer (`/components/footer.tsx`)
- Company information
- Quick links
- Contact information
- Social media links
- Bottom copyright bar

### Product Card (`/components/product-card.tsx`)
- Product image with hover effect
- Favorite button
- Rating display
- Price display
- Add to cart button with feedback

### Product List (`/components/product-list.tsx`)
- Responsive grid layout
- Product cards
- Loading states

## 🔧 Customization

### Adding New Products
Edit `/lib/products.ts`:
```typescript
{
  id: 'new-id',
  name: 'Product Name',
  description: 'Description',
  price: 3000,
  image: '/products/image.jpg',
  rating: 5,
  reviews: 100,
  category: 'Bracelets',
  colors: ['Color1', 'Color2'],
  inStock: true,
}
```

### Changing Colors
Edit `/app/globals.css` - Update oklch color values in `:root` section

### Updating Logo
Replace `/public/logo.png` with new logo file

### Modifying Content
- Home page: `/app/page.tsx`
- Shop page: `/app/shop/page.tsx`
- Footer: `/components/footer.tsx`
- Product descriptions: `/lib/products.ts`

## 📊 Performance Features

- **Image Optimization**: Next.js Image component for optimal loading
- **Responsive Design**: Mobile-first approach
- **LocalStorage Caching**: Cart persists across sessions
- **Lazy Loading**: Product images load efficiently

## 🔐 Security Notes

- M-Pesa integration is simulated for demo purposes
- Form validation on shipping and payment steps
- No real payment processing (demonstration only)
- HTTPS recommended for production deployment

## 📞 Support & Contact

- Email: hello@ajubeads.com
- Phone: +254 712 345 678
- Location: Nairobi, Kenya

## 🎁 Special Features

- **Free Shipping**: On orders over KES 5,000
- **Tax Calculation**: 16% automatically added
- **Order Tracking**: Simulated timeline
- **30-Day Returns**: Return policy displayed
- **Newsletter**: Subscription form on home page
- **Related Products**: Suggestions on product detail page

## 🚀 Deployment

Ready for production deployment to Vercel:
1. Connect GitHub repository
2. Set environment variables (none needed for demo)
3. Deploy with one click
4. M-Pesa integration requires real API key for production

## 📦 Project Structure

```
/app
  /page.tsx              # Home page
  /shop/page.tsx         # Shop page
  /product/[id]/page.tsx # Product detail
  /cart/page.tsx         # Shopping cart
  /checkout/page.tsx     # Checkout flow
  /order-confirmation/   # Order confirmation
  /about/page.tsx        # About page
  /contact/page.tsx      # Contact page
  /globals.css           # Global styles
  /layout.tsx            # Root layout

/components
  /header.tsx            # Navigation header
  /footer.tsx            # Footer
  /product-card.tsx      # Product card component

/lib
  /products.ts           # Product data
  /cart-context.tsx      # Cart context (optional)

/public
  /logo.png              # Ajabu Beads logo
  /hero-banner.jpg       # Hero image
  /products/             # Product images
```

## ✨ Highlights

- Beautiful, professional e-commerce design
- Inspired by Kazuri.co.ke's elegant aesthetic
- Fully functional shopping experience
- Smooth M-Pesa payment simulation
- Mobile-first responsive design
- Fast loading times
- Ethical business messaging
- Social proof through reviews and ratings

---

**Built with Next.js 16, React 19, Tailwind CSS, and Lucide Icons**

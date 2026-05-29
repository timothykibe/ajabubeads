# Ajabu Beads - Deployment Guide

## Project Overview
Ajabu Beads is a fully functional e-commerce website for handcrafted African and Indian beads and bracelets. The site features:
- Beautiful hero slider with auto-rotating images
- Product shop with 13 items
- Shopping cart with localStorage persistence
- Complete checkout process with M-Pesa payment simulation
- Form validation with error handling
- Active route detection in navigation
- Elegant typography with Playfair Display font
- Fully responsive mobile-first design

## Getting Started

### Installation
```bash
# Using the shadcn CLI
pnpm dlx shadcn-cli@latest init

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

The app will be available at `http://localhost:3000`

## Key Features

### Hero Slider
- 5 rotating slides with beautiful African bead imagery
- Auto-plays every 5 seconds
- Pause on hover
- Manual navigation with arrow buttons and dot indicators

### Navigation
- Active menu item highlighting
- Desktop and mobile responsive
- Hamburger menu on mobile devices
- Logo with brand name

### Shopping Experience
- Browse 13 unique beaded bracelets
- Filter by price and category
- Add to cart functionality
- Shopping cart with quantity adjustment
- Real-time cart total calculations

### Checkout Flow
1. **Shipping Info**: Collect customer details with validation
2. **M-Pesa Payment**: Simulate mobile money payment
3. **Confirmation**: Order confirmation page

### Form Validation
All form fields include real-time validation:
- Required field checks
- Email format validation
- Phone number validation (Kenyan format)
- Transaction code length validation
- Error messages displayed inline

## Design System

### Color Palette
- Primary Gold: Used for main CTAs and highlights
- Earth Tones: Background and secondary elements
- Warm Off-white: Main background
- Deep Brown: Text and foreground

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Geist (sans-serif)
- **Mono**: Geist Mono (for code)

### Responsive Breakpoints
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

## File Structure
```
app/
├── page.tsx                 # Home page with hero slider
├── shop/page.tsx           # Shop page with products
├── product/[id]/page.tsx   # Product detail page
├── cart/page.tsx           # Shopping cart page
├── checkout/page.tsx       # Checkout with M-Pesa
├── order-confirmation/     # Order confirmation
├── about/page.tsx          # About page
├── contact/page.tsx        # Contact page
└── layout.tsx              # Root layout

components/
├── header.tsx              # Navigation with active routes
├── footer.tsx              # Footer
├── hero-slider.tsx         # Auto-rotating hero carousel
├── product-card.tsx        # Product card component
└── ui/                     # shadcn components

lib/
├── products.ts             # Product data
└── cart-context.tsx        # Cart management

public/
├── logo.png                # Ajabu Beads logo
├── hero/                   # Hero slider images (5)
└── products/               # Product images (10)
```

## Environment Setup

No environment variables are required for the mock version. The app uses:
- `localStorage` for cart persistence
- Mock data for products and orders
- Simulated M-Pesa payment flow

## Testing Checklist

- [ ] Hero slider rotates automatically
- [ ] Navigation shows active route
- [ ] Products load on shop page
- [ ] Add to cart functionality works
- [ ] Cart persists after page reload
- [ ] Checkout form validates inputs
- [ ] M-Pesa payment simulation completes
- [ ] Responsive design works on mobile
- [ ] All images load correctly

## Known Limitations (Mock Version)

- M-Pesa payment is simulated (no real transaction)
- Cart data stored locally (not synced to server)
- No user authentication
- No order history
- No product inventory management

## Future Enhancements

To convert to production:
1. Integrate real M-Pesa API
2. Add backend database (Supabase, Neon, etc.)
3. Implement user authentication
4. Add order management system
5. Implement email notifications
6. Add payment webhook handling
7. Set up CDN for images
8. Add analytics tracking

## Performance Optimization

The site is already optimized with:
- Next.js Image component for image optimization
- CSS-in-JS for reduced CSS size
- Lazy loading on product images
- Efficient state management with React hooks
- LocalStorage for client-side persistence

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Deployment Options

### Vercel (Recommended)
```bash
git push  # Push to GitHub
# Visit vercel.com and connect your repository
```

### Other Platforms
- Next.js can be deployed to any Node.js hosting
- Works with Docker
- Supports serverless functions

## Support

For issues or questions:
1. Check the IMPROVEMENTS_MADE.md file for feature details
2. Review component code in `/components`
3. Check product data in `/lib/products.ts`

## License
Created for Ajabu Beads - Handcrafted African & Indian Jewelry

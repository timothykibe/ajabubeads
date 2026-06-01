'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import HeroSlider from '@/components/hero-slider';
import NewsletterPopup from '@/components/newsletter-popup';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { ShoppingCart, Heart, Truck, Zap } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string;
  inStock: boolean;
}

export default function Home() {
  const [cart, setCart] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true&take=4');
        if (response.ok) {
          const data = await response.json();
          const featuredProductsArray = Array.isArray(data?.data?.products) ? data.data.products : [];
          setFeaturedProducts(featuredProductsArray);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('ajabuCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (typeof window === 'undefined') return;

      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if (!accessToken && !refreshToken) {
        return;
      }

      const profileResponse = await apiClient.auth.getProfile();
      const authError = profileResponse.error?.toLowerCase() || '';

      if (profileResponse.success && profileResponse.data) {
        apiClient.setUser(profileResponse.data);
        return;
      }

      if (refreshToken && (authError.includes('unauthorized') || authError.includes('invalid') || !accessToken)) {
        const refreshResult = await apiClient.refreshAccessToken();
        if (refreshResult) {
          const refreshedProfile = await apiClient.auth.getProfile();
          if (refreshedProfile.success && refreshedProfile.data) {
            apiClient.setUser(refreshedProfile.data);
            return;
          }
        }
      }

      if (authError.includes('unauthorized') || authError.includes('invalid')) {
        apiClient.clearAccessToken();
        apiClient.clearRefreshToken();
        apiClient.clearUser();
      }
    };

    checkAuthStatus();
  }, []);

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNewsletterStatus('sending');
    setNewsletterMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      if (!response.ok) {
        const data = await response.json();
        setNewsletterStatus('error');
        setNewsletterMessage(data?.message || 'Unable to subscribe right now.');
        return;
      }

      setNewsletterStatus('success');
      setNewsletterMessage('Thank you! You are now subscribed.');
      localStorage.setItem('ajabuNewsletterSubscribed', 'true');
      localStorage.setItem('ajabuNewsletterPopupDismissedAt', Date.now().toString());
      setNewsletterEmail('');
    } catch (error) {
      setNewsletterStatus('error');
      setNewsletterMessage('Failed to subscribe. Please try again later.');
      console.error('Newsletter subscribe error:', error);
    }
  };

  const handleAddToCart = (productId: string) => {
    const product = featuredProducts.find((p) => p.id === productId);
    if (!product) return;

    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === productId);
      let updated;
      if (existingItem) {
        updated = prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prev, { ...product, quantity: 1 }];
      }
      localStorage.setItem('ajabuCart', JSON.stringify(updated));
      return updated;
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="min-h-screen bg-background">
      <Header cartCount={cartCount} />

      {/* Hero Slider Section */}
      <HeroSlider />

      {/* Value Proposition */}
      <section className="py-12 md:py-16 px-4 lg:px-8 bg-secondary/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Heart className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Ethically Made</h3>
            <p className="text-muted-foreground">
              Each piece crafted by artisans with fair wages and sustainable practices
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Zap className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Handcrafted Quality</h3>
            <p className="text-muted-foreground">
              Traditional techniques meets contemporary design for timeless jewelry
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Truck className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Fast Shipping</h3>
            <p className="text-muted-foreground">
              Quick delivery across East Africa with secure packaging
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              Featured Collections
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our most loved handcrafted bracelets, each telling a unique story of African and Indian artistry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.images?.[0] || '/placeholder.png'}
                rating={product.rating}
                reviews={product.reviewCount}
                onAddToCart={handleAddToCart}
                showAddToCart={true}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 md:py-20 px-4 lg:px-8 bg-secondary/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-64 md:h-96">
            <Image
              src="/products/bracelet-2.jpg"
              alt="Ajabu Beads Story"
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              The Ajabu Story
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Ajabu Beads is a celebration of African and Indian artistry. Each bead tells a story of tradition, culture, and craftsmanship passed down through generations.
              </p>
              <p>
                We partner directly with artisans across Kenya and the region, ensuring fair wages and sustainable practices. Our mission is to create jewelry that doesn&apos;t just look beautiful, but also makes a positive impact.
              </p>
              <p>
                From the clay we use to the techniques we employ, everything is thoughtfully chosen to honor the heritage and support the communities that make Ajabu possible.
              </p>
            </div>
            <Link href="/about">
              <Button variant="outline">Learn More About Us</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 md:py-16 px-4 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">
            Stay Updated
          </h2>
          <p className="text-primary-foreground/90">
            Subscribe to our newsletter for new collections, exclusive offers, and stories from our artisans.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              value={newsletterEmail}
              onChange={(event) => setNewsletterEmail(event.target.value)}
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground/20 border border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary-foreground"
            />
            <Button
              type="submit"
              disabled={newsletterStatus === 'sending'}
              className="bg-primary-foreground text-primary hover:bg-secondary"
            >
              {newsletterStatus === 'sending' ? 'Sending…' : 'Subscribe'}
            </Button>
          </form>
          {newsletterMessage ? (
            <p className={`mt-4 text-sm ${newsletterStatus === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {newsletterMessage}
            </p>
          ) : null}
        </div>
      </section>

      <NewsletterPopup />

      <Footer />
    </main>
  );
}

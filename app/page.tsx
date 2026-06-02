'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import HeroSlider from '@/components/hero-slider';
import NewsletterPopup from '@/components/newsletter-popup';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { ShoppingCart, Heart, Truck, Zap, ShieldCheck, CreditCard, Lock, Star, Users, Globe, Leaf } from 'lucide-react';

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
  const [showStickyCart, setShowStickyCart] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

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

  // Sticky cart visibility logic
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky cart only after scrolling past header
      const header = document.querySelector('header');
      if (header) {
        const headerHeight = header.offsetHeight;
        if (window.scrollY > headerHeight + 100) {
          setShowStickyCart(true);
        } else {
          setShowStickyCart(false);
        }
      }
      
      // Handle scrolling state for sticky cart animation
      setScrolling(true);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        setScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
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
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <main className="min-h-screen bg-background">
      <Header cartCount={cartCount} />

      {/* Hero Slider Section */}
      <HeroSlider />

      {/* Value Proposition - Enhanced with better icons and styling */}
      <section className="py-12 md:py-16 px-4 lg:px-8 bg-gradient-to-b from-secondary/20 to-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3 group transition-all duration-300 hover:-translate-y-2">
            <div className="flex justify-center">
              <Heart className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-semibold text-xl">Ethically Made</h3>
            <p className="text-muted-foreground">
              Each piece crafted by artisans with fair wages and sustainable practices
            </p>
          </div>
          
          <div className="text-center space-y-3 group transition-all duration-300 hover:-translate-y-2">
            <div className="flex justify-center">
              <Zap className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-semibold text-xl">Handcrafted Quality</h3>
            <p className="text-muted-foreground">
              Traditional techniques meets contemporary design for timeless jewelry
            </p>
          </div>
          
          <div className="text-center space-y-3 group transition-all duration-300 hover:-translate-y-2">
            <div className="flex justify-center">
              <Truck className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-semibold text-xl">Fast Shipping</h3>
            <p className="text-muted-foreground">
              Quick delivery across East Africa with secure packaging
            </p>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Our Mission - Mission-driven content */}
      <section className="py-16 md:py-24 px-4 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
            <Leaf className="h-4 w-4" />
            Our Promise
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900">
            Celebrating African
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            At Ajabu Beads, we believe jewelry should tell a story. Each bead is handcrafted by talented artisans across Kenya, combining traditional African techniques with Indian craftsmanship passed down through generations.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-5 w-5 text-primary" />
              Empowering 50+ Artisans
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="h-5 w-5 text-primary" />
              Sustainable Practices
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Heart className="h-5 w-5 text-primary" />
              Fair Trade Certified
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: Shop by Category - Enhanced product navigation */}
      <section className="py-16 md:py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our collections of handcrafted jewelry, each piece uniquely designed and ethically made
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Necklaces', href: '/shop?category=necklaces', image: '/categories/necklaces.jpg', items: '24 styles' },
              { name: 'Bracelets', href: '/shop?category=bracelets', image: '/categories/bracelets.jpg', items: '18 styles' },
              { name: 'Earrings', href: '/shop?category=earrings', image: '/categories/earrings.jpg', items: '15 styles' },
              { name: 'Bags & Accessories', href: '/shop?category=bags', image: '/categories/bags.jpg', items: '12 styles' },
            ].map((category) => (
              <Link key={category.name} href={category.href} className="group relative overflow-hidden rounded-2xl shadow-lg">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-sm text-white/80">{category.items}</p>
                    <span className="mt-2 inline-block text-sm font-medium opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                      Shop Now →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-20 px-4 lg:px-8 bg-secondary/5">
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

      {/* NEW SECTION: Testimonials - Social proof */}
      <section className="py-16 md:py-24 px-4 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of happy customers who love their Ajabu Beads jewelry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah M.', rating: 5, text: 'Absolutely stunning craftsmanship! The necklace arrived beautifully packaged and exceeded my expectations. Will definitely be ordering again.', location: 'Nairobi, Kenya' },
              { name: 'James K.', rating: 5, text: 'The attention to detail is incredible. Each bead tells a story, and knowing it supports local artisans makes it even more special.', location: 'Mombasa, Kenya' },
              { name: 'Grace W.', rating: 5, text: 'Fast shipping and excellent customer service. The bracelets are even more beautiful in person. Highly recommend Ajabu Beads!', location: 'Kisumu, Kenya' },
            ].map((testimonial, index) => (
              <div key={index} className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                  <div className="text-primary text-sm">✓ Verified Buyer</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Enhanced with artisan story */}
      <section className="py-12 md:py-20 px-4 lg:px-8 bg-secondary/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/products/bracelet-2.jpg"
              alt="Ajabu Beads artisans at work"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              Our Story
            </div>
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

      {/* NEW SECTION: Artisan Spotlight - Community focus */}
      <section className="py-16 md:py-24 px-4 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mx-auto">
              Behind the Craft
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">
              Meet Our Artisans
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every piece of Ajabu jewelry is handcrafted with love by skilled artisans across Kenya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Grace Wanjiku', role: 'Master Bead Artist', years: '12 years', image: '/artisans/grace.jpg', quote: 'Each bead I create carries a piece of our heritage. Its not just jewelry—its a story waiting to be told.' },
              { name: 'Esther Muthoni', role: 'Ceramic Specialist', years: '8 years', image: '/artisans/esther.jpg', quote: 'Working with clay from Mount Kenya connects me to my ancestors. Every piece is a labor of love.' },
              { name: 'Beatrice Atieno', role: 'Design Curator', years: '10 years', image: '/artisans/beatrice.jpg', quote: 'I love blending traditional patterns with modern styles. It keeps our culture alive and relevant.' },
            ].map((artisan, index) => (
              <div key={index} className="group rounded-2xl border border-border bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="aspect-square relative">
                  <Image
                    src={artisan.image}
                    alt={artisan.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-xl text-gray-900">{artisan.name}</h3>
                  <p className="text-sm text-primary mt-1">{artisan.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">{artisan.years} of experience</p>
                  <p className="text-sm text-gray-600 mt-4 italic">"{artisan.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter - Enhanced with incentive */}
      <section className="py-12 md:py-20 px-4 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            ✨ Exclusive Offers
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">
            Join Our Community
          </h2>
          <p className="text-primary-foreground/90">
            Subscribe to our newsletter for new collections, exclusive offers, and stories from our artisans.
          </p>
          <p className="text-sm font-medium text-primary-foreground/80">
            🎁 Get 10% off your first order when you subscribe!
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
              className="bg-primary-foreground text-primary hover:bg-secondary font-semibold"
            >
              {newsletterStatus === 'sending' ? 'Sending…' : 'Subscribe & Save 10%'}
            </Button>
          </form>
          {newsletterMessage ? (
            <p className={`mt-4 text-sm ${newsletterStatus === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {newsletterMessage}
            </p>
          ) : null}
        </div>
      </section>

      {/* Sticky Add-to-Cart Bar for Mobile */}
      {showStickyCart && cartCount > 0 && (
        <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-50 transition-transform duration-300 ${scrolling ? 'translate-y-0' : 'translate-y-0'} md:hidden`}>
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-gray-900">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
                <p className="text-xs text-muted-foreground">KES {cartTotal.toLocaleString()}</p>
              </div>
            </div>
            <Link href="/cart">
              <Button className="bg-primary hover:bg-primary/90 text-white px-6">
                View Cart →
              </Button>
            </Link>
          </div>
        </div>
      )}

      <NewsletterPopup />
      <Footer />
    </main>
  );
}
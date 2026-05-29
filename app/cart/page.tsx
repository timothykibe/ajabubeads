'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ajabuCart');
    setCartItems(saved ? JSON.parse(saved) : []);
    setIsLoaded(true);
    setIsAuthenticated(
      typeof window !== 'undefined' && !!localStorage.getItem('accessToken')
    );
  }, []);

  const updateCart = (items: any[]) => {
    setCartItems(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ajabuCart', JSON.stringify(items));
    }
  };

  const itemKey = (item: any) => `${item.id}-${item.selectedColor || 'none'}-${item.selectedSize || 'none'}`;

  const handleRemove = (itemKeyValue: string) => {
    updateCart(cartItems.filter((item) => itemKey(item) !== itemKeyValue));
  };

  const handleQuantityChange = (itemKeyValue: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemove(itemKeyValue);
      return;
    }
    updateCart(
      cartItems.map((item) =>
        itemKey(item) === itemKeyValue ? { ...item, quantity } : item
      )
    );
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 5000 ? 0 : 500;
  const tax = Math.round(subtotal * 0.16);
  const total = subtotal + shipping + tax;

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header cartCount={cartItems.length} />

      {/* Page Header */}
      <div className="bg-secondary/20 py-8 md:py-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold">
            Shopping Cart
          </h1>
        </div>
      </div>

      {/* Cart Content */}
      <div className="flex-1 py-8 md:py-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {!isLoaded ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Loading cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            // Empty Cart
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Add some beautiful bracelets to get started
              </p>
              <Link href="/shop">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={itemKey(item)}
                      className="flex gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-md transition-shadow"
                    >
                      {/* Product Image */}
                      <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                        <Image
                          src={item.image || item.images?.[0] || '/products/bracelet-1.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <Link
                            href={`/product/${item.id}`}
                            className="font-semibold hover:text-primary transition-colors mb-1"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {item.description?.substring(0, 80)}...
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <div className="text-primary font-bold">
                            KES {item.price.toLocaleString()}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(itemKey(item), item.quantity - 1)
                              }
                              className="px-2 py-1 border border-border rounded hover:bg-muted transition-colors"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(itemKey(item), item.quantity + 1)
                              }
                              className="px-2 py-1 border border-border rounded hover:bg-muted transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(itemKey(item))}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="mt-8">
                  <Link href="/shop">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg p-6 space-y-6 sticky top-24">
                  <h2 className="font-serif text-xl font-bold">Order Summary</h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>KES {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600 font-medium">Free</span>
                        ) : (
                          `KES ${shipping}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (16%)</span>
                      <span>KES {tax.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">
                        KES {total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {!isAuthenticated && (
                    <div className="rounded-3xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
                      <p className="font-medium mb-2">Please login or register to continue to checkout.</p>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                          href="/login?redirect=/cart"
                          className="inline-flex items-center justify-center rounded-full border border-primary px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                        >
                          Login
                        </Link>
                        <Link
                          href="/register?redirect=/cart"
                          className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Promo Code */}
                  <div>
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Checkout Button */}
                  {isAuthenticated ? (
                    <Link href="/checkout" className="w-full block">
                      <Button className="w-full py-6 text-base">
                        Proceed to Checkout
                      </Button>
                    </Link>
                  ) : (
                    <Button className="w-full py-6 text-base" disabled>
                      Login to Checkout
                    </Button>
                  )}

                  {/* Info */}
                  <div className="text-xs text-muted-foreground space-y-2">
                    <p>✓ Free shipping on orders over KES 5,000</p>
                    <p>✓ Secure M-Pesa checkout</p>
                    <p>✓ 30-day returns policy</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

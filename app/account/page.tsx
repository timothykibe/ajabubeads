'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, Heart, PackageCheck, ShoppingBag, Clock } from 'lucide-react';
import { Order, User, Product } from '@/lib/types';

interface SavedProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      router.push('/login?redirect=/account');
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          fetch('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/orders?take=20', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (!profileRes.ok) {
          throw new Error('Unable to load profile');
        }
        if (!ordersRes.ok) {
          throw new Error('Unable to load orders');
        }

        const profileData = await profileRes.json();
        const ordersData = await ordersRes.json();
        setProfile(profileData.data);
        setOrders(Array.isArray(ordersData?.data?.orders) ? ordersData.data.orders : []);
        // fetch saved products from backend
        try {
          const savedRes = await fetch('/api/user/saved-products', { headers: { Authorization: `Bearer ${token}` } });
          if (savedRes.ok) {
            const savedData = await savedRes.json();
            setSavedProducts(savedData.data?.items || []);
          } else {
            setSavedProducts([]);
          }
        } catch (e) {
          setSavedProducts([]);
        }
      } catch (err) {
        console.error(err);
        setError('Unable to load account information. Please log in again.');
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // saved products are loaded from backend in fetchData
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <Header cartCount={0} />

      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">My Account</p>
            <h1 className="text-4xl font-serif font-bold">Welcome back{profile?.name ? `, ${profile.name}` : ''}</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
            <Link href="/cart">
              <Button>View Cart</Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="mt-12 rounded-3xl border border-border bg-card p-10 text-center text-muted-foreground">
            Loading your account...
          </div>
        ) : error ? (
          <div className="mt-12 rounded-3xl border border-destructive/20 bg-destructive/5 p-10 text-center text-destructive">
            {error}
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-8">
              <section className="rounded-3xl border border-border bg-card p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-primary">Profile</p>
                    <h2 className="text-2xl font-semibold">Account details</h2>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <CheckCircle className="h-4 w-4" />
                    Verified
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 mt-6">
                  <div className="rounded-3xl border border-border bg-background p-5">
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="mt-2 font-semibold">{profile?.name || 'Not set'}</p>
                  </div>
                  <div className="rounded-3xl border border-border bg-background p-5">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="mt-2 font-semibold">{profile?.email}</p>
                  </div>
                  <div className="rounded-3xl border border-border bg-background p-5">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="mt-2 font-semibold">{profile?.phone || 'Not set'}</p>
                  </div>
                  <div className="rounded-3xl border border-border bg-background p-5">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="mt-2 font-semibold">
                      {profile?.city || 'City'}, {profile?.country || 'Kenya'}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-primary">Order History</p>
                    <h2 className="text-2xl font-semibold">Recent orders</h2>
                  </div>
                  <Link href="/orders" className="text-sm text-primary hover:underline">
                    View all orders
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="mt-8 rounded-3xl border border-border bg-background p-8 text-center text-muted-foreground">
                    No orders found yet. Place your first order and track it from here.
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="rounded-3xl border border-border bg-background p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
                            <p className="mt-1 text-lg font-semibold">{formatDate(order.createdAt)}</p>
                          </div>
                          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                            <Clock className="h-4 w-4" />
                            {order.status.toLowerCase()}
                          </div>
                        </div>
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-sm text-muted-foreground">
                            {order.items.length} items · KES {order.total.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Payment: {order.paymentStatus.toLowerCase()}
                          </div>
                        </div>
                        <Link href={`/order-confirmation?orderId=${order.id}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                          <ShoppingBag className="h-4 w-4" />
                          Track order
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <aside className="space-y-8">
              <section className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-primary">Saved</p>
                    <h2 className="text-xl font-semibold">Saved products</h2>
                  </div>
                </div>

                {savedProducts.length === 0 ? (
                  <div className="mt-6 rounded-3xl border border-dashed border-border/70 bg-background p-6 text-center text-muted-foreground">
                    <p className="mb-3">Save items from product pages and they will appear here.</p>
                    <Link href="/shop">
                      <Button variant="outline" className="mt-2">
                        Browse products
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    {savedProducts.slice(0, 5).map((product) => (
                      <Link key={product.id} href={`/product/${product.id}`} className="group block rounded-3xl border border-border bg-background overflow-hidden transition hover:shadow-lg">
                        <div className="flex items-center gap-4 p-4">
                          <div className="relative h-20 w-20 overflow-hidden rounded-3xl bg-muted">
                            <img
                              src={product.image || '/placeholder.png'}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold">{product.name}</p>
                            <p className="text-sm text-muted-foreground">KES {product.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <PackageCheck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-primary">Quick access</p>
                    <h2 className="text-xl font-semibold">Account shortcuts</h2>
                  </div>
                </div>
                <div className="mt-6 grid gap-3">
                  <Link href="/account" className="rounded-3xl border border-border bg-background px-4 py-4 text-sm font-medium hover:bg-muted">
                    View account dashboard
                  </Link>
                  <Link href="/shop" className="rounded-3xl border border-border bg-background px-4 py-4 text-sm font-medium hover:bg-muted">
                    Continue shopping
                  </Link>
                  <Link href="/cart" className="rounded-3xl border border-border bg-background px-4 py-4 text-sm font-medium hover:bg-muted">
                    Go to cart
                  </Link>
                </div>
              </section>
            </aside>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

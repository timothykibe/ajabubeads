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
  const [selectedSection, setSelectedSection] = useState<'overview' | 'orders' | 'saved' | 'kyc'>('overview');
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
    const handleSavedUpdated = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (!token) return;
      try {
        const savedRes = await fetch('/api/user/saved-products', { headers: { Authorization: `Bearer ${token}` } });
        if (savedRes.ok) {
          const savedData = await savedRes.json();
          setSavedProducts(savedData.data?.items || []);
        }
      } catch (e) {
        // ignore
      }
    };

    window.addEventListener('ajabuSavedProductsChanged', handleSavedUpdated as EventListener);
    return () => {
      window.removeEventListener('ajabuSavedProductsChanged', handleSavedUpdated as EventListener);
    };
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('adminToken');
      window.dispatchEvent(new Event('auth-changed'));
    }
    router.push('/login');
  };

  const menuItems = [
    { key: 'overview', label: 'Overview', icon: CheckCircle },
    { key: 'orders', label: 'Order history', icon: ShoppingBag },
    { key: 'saved', label: 'Saved products', icon: Heart },
    { key: 'kyc', label: 'KYC & verification', icon: Clock },
  ];

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
          <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="space-y-6 rounded-3xl border border-border bg-card p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-primary">My Account</p>
                <h2 className="mt-3 text-2xl font-semibold">Quick menu</h2>
                <p className="text-sm text-muted-foreground mt-2">Manage orders, saved items, and profile settings all from one place.</p>
              </div>

              <div className="space-y-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setSelectedSection(item.key as any)}
                      className={`w-full rounded-3xl px-4 py-4 transition shadow-sm border ${
                        selectedSection === item.key
                          ? 'border-primary bg-primary/10 text-primary shadow-primary/10'
                          : 'border-border bg-background text-foreground hover:border-primary hover:bg-primary/5'
                      } flex items-center gap-3 text-left`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-3xl border border-border bg-background p-5">
                <p className="text-sm text-muted-foreground">Need help?</p>
                <p className="mt-3 text-sm text-foreground">Contact support at <strong>support@ajabubeads.co.ke</strong> for account or order assistance.</p>
              </div>
            </aside>

            <section className="space-y-6">
              <div className="rounded-[2rem] border border-border bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-[0_30px_75px_-35px_rgba(15,23,42,0.15)]">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-primary">Account overview</p>
                    <h1 className="text-4xl font-serif font-bold">Your dashboard</h1>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                      At a glance: orders, wishlist, profile health and quick actions.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/cart">
                      <Button>View cart</Button>
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive transition hover:bg-destructive/20"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setSelectedSection('orders')}
                  className="rounded-3xl border border-border bg-white px-4 py-4 text-sm font-medium text-foreground transition hover:border-primary hover:bg-primary/5"
                >
                  View orders
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSection('saved')}
                  className="rounded-3xl border border-border bg-white px-4 py-4 text-sm font-medium text-foreground transition hover:border-primary hover:bg-primary/5"
                >
                  Open wishlist
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSection('overview')}
                  className="rounded-3xl border border-border bg-white px-4 py-4 text-sm font-medium text-foreground transition hover:border-primary hover:bg-primary/5"
                >
                  Edit profile
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setSelectedSection('orders')}
                  className="rounded-3xl border border-border bg-background p-6 shadow-sm text-left transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 text-primary">
                    <PackageCheck className="h-5 w-5" />
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em]">Orders</p>
                      <p className="mt-2 text-3xl font-semibold">{orders.length}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">See recent orders and view shipping status.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSection('saved')}
                  className="rounded-3xl border border-border bg-background p-6 shadow-sm text-left transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 text-primary">
                    <Heart className="h-5 w-5" />
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em]">Saved items</p>
                      <p className="mt-2 text-3xl font-semibold">{savedProducts.length}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">Your wishlist is synced across product pages and account view.</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSection('kyc')}
                  className="rounded-3xl border border-border bg-background p-6 shadow-sm text-left transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 text-primary">
                    <CheckCircle className="h-5 w-5" />
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em]">KYC status</p>
                      <p className="mt-2 text-3xl font-semibold text-emerald-600">
                        {profile?.phone && profile?.address && profile?.city ? 'Verified' : 'Pending'}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">Complete your profile to improve checkout speed and security.</p>
                </button>
              </div>

              {selectedSection === 'overview' && (
                <div className="space-y-6">
                  <section className="rounded-3xl border border-border bg-card p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-primary">Profile</p>
                        <h2 className="text-2xl font-semibold">Account details</h2>
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        <CheckCircle className="h-4 w-4" />
                        {profile?.phone && profile?.address && profile?.city ? 'Verified' : 'Complete profile'}
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
                        <p className="mt-2 font-semibold">{profile?.city || 'City'}, {profile?.country || 'Kenya'}</p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-3xl border border-border bg-card p-6">
                    <h2 className="text-2xl font-semibold">Recent activity</h2>
                    <p className="text-sm text-muted-foreground mt-2">Your latest orders, saved items and account status in one place.</p>
                  </section>
                </div>
              )}

              {selectedSection === 'orders' && (
                <section className="rounded-3xl border border-border bg-card p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-primary">Order history</p>
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
                      {orders.map((order) => (
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
                          <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground">
                            <div>{order.items.length} items · KES {order.total.toLocaleString()}</div>
                            <div>Payment: {order.paymentStatus.toLowerCase()}</div>
                          </div>
                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <Link href={`/order-confirmation?orderId=${order.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                              <ShoppingBag className="h-4 w-4" />
                              Track order
                            </Link>
                            <Link href={`/orders`} className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20">
                              View all orders
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {selectedSection === 'saved' && (
                <section className="rounded-3xl border border-border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-primary">Saved products</p>
                      <h2 className="text-xl font-semibold">Your wishlist</h2>
                    </div>
                  </div>

                  {savedProducts.length === 0 ? (
                    <div className="mt-6 rounded-3xl border border-dashed border-border/70 bg-background p-6 text-center text-muted-foreground">
                      <p className="mb-3">Save products while browsing and return to them here.</p>
                      <Link href="/shop">
                        <Button variant="outline" className="mt-2">
                          Browse products
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-6 grid gap-4">
                      {savedProducts.map((product) => (
                        <div key={product.id} className="group rounded-3xl border border-border bg-background p-4 transition hover:shadow-lg">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-20 w-20 overflow-hidden rounded-3xl bg-muted">
                                <img src={product.image || '/placeholder.png'} alt={product.name} className="h-full w-full object-cover" />
                              </div>
                              <div>
                                <p className="font-semibold">{product.name}</p>
                                <p className="text-sm text-muted-foreground">KES {product.price.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Link href={`/product/${product.id}`} className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20">
                                View product
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {selectedSection === 'kyc' && (
                <section className="rounded-3xl border border-border bg-card p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-primary">KYC & verification</p>
                      <h2 className="text-2xl font-semibold">Identity status</h2>
                    </div>
                    <span className={`rounded-full px-4 py-2 text-sm font-medium ${profile?.phone && profile?.address && profile?.city ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                      {profile?.phone && profile?.address && profile?.city ? 'Verified' : 'Pending'}
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 mt-6">
                    <div className="rounded-3xl border border-border bg-background p-5">
                      <p className="text-sm text-muted-foreground">ID / Profile</p>
                      <p className="mt-2 font-semibold">{profile?.phone ? 'Phone linked' : 'Phone missing'}</p>
                    </div>
                    <div className="rounded-3xl border border-border bg-background p-5">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="mt-2 font-semibold">{profile?.address ? 'Address on file' : 'No address yet'}</p>
                    </div>
                    <div className="rounded-3xl border border-border bg-background p-5">
                      <p className="text-sm text-muted-foreground">City</p>
                      <p className="mt-2 font-semibold">{profile?.city || 'Not provided'}</p>
                    </div>
                    <div className="rounded-3xl border border-border bg-background p-5">
                      <p className="text-sm text-muted-foreground">Country</p>
                      <p className="mt-2 font-semibold">{profile?.country || 'Kenya'}</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-3xl border border-dashed border-border/70 bg-background p-6 text-sm text-muted-foreground">
                    Add more profile details to improve account security and checkout speed.
                  </div>
                </section>
              )}
            </section>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

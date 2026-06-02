'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, Heart, PackageCheck, ShoppingBag, Clock, MapPin, Phone, Mail, LogOut } from 'lucide-react';
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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header cartCount={0} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header section - simplified, no duplicate CTA buttons */}
        <div className="mb-8">
          <p className="text-sm font-medium text-primary/80">My Account</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mt-1">
            Welcome back{profile?.name ? `, ${profile.name}` : ''}
          </h1>
          <p className="text-gray-500 mt-2">Manage your orders, wishlist, and profile settings.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64 rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading your account...</p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-center">
            <p className="text-red-600">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try again
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Sidebar - cleaner, more compact */}
            <aside className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                    {profile?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{profile?.name || 'Customer'}</p>
                    <p className="text-xs text-gray-500">{profile?.email}</p>
                  </div>
                </div>

                <nav className="mt-4 space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setSelectedSection(item.key as any)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          selectedSection === item.key
                            ? 'bg-primary/10 text-primary'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>

                <button
                  onClick={handleLogout}
                  className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Support</p>
                <p className="mt-2 text-sm text-gray-600">Need help with your account or orders?</p>
                <a
                  href="mailto:support@ajabubeads.co.ke"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" />
                  support@ajabubeads.co.ke
                </a>
              </div>
            </aside>

            {/* Main content - streamlined, less redundant */}
            <div className="space-y-6">
              {/* Quick stats row - merged from duplicate buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setSelectedSection('orders')}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left transition hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total orders</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
                    </div>
                    <PackageCheck className="h-8 w-8 text-primary/60 group-hover:text-primary transition" />
                  </div>
                  <p className="text-xs text-gray-400 mt-3">View order history →</p>
                </button>
                <button
                  onClick={() => setSelectedSection('saved')}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left transition hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Wishlist</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{savedProducts.length}</p>
                    </div>
                    <Heart className="h-8 w-8 text-primary/60 group-hover:text-primary transition" />
                  </div>
                  <p className="text-xs text-gray-400 mt-3">Manage saved items →</p>
                </button>
                <button
                  onClick={() => setSelectedSection('kyc')}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-left transition hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Verification</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {profile?.phone && profile?.address && profile?.city ? '✓' : 'Pending'}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-primary/60 group-hover:text-primary transition" />
                  </div>
                  <p className="text-xs text-gray-400 mt-3">Complete your KYC →</p>
                </button>
              </div>

              {/* Dynamic section content */}
              {selectedSection === 'overview' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Profile details</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Your personal information</p>
                  </div>
                  <div className="p-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-400">Full name</p>
                          <p className="font-medium text-gray-900">{profile?.name || 'Not set'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-400">Email address</p>
                          <p className="font-medium text-gray-900">{profile?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-400">Phone number</p>
                          <p className="font-medium text-gray-900">{profile?.phone || 'Not set'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-400">Location</p>
                          <p className="font-medium text-gray-900">
                            {profile?.city || 'City'}, {profile?.country || 'Kenya'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <Link href="/profile/edit" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                        Edit profile →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {selectedSection === 'orders' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center flex-wrap gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Order history</h2>
                      <p className="text-sm text-gray-500 mt-0.5">Recent purchases</p>
                    </div>
                    <Link href="/orders" className="text-sm font-medium text-primary hover:underline">
                      View all →
                    </Link>
                  </div>
                  {orders.length === 0 ? (
                    <div className="p-10 text-center">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <ShoppingBag className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="mt-3 text-gray-500">No orders yet.</p>
                      <Link href="/shop">
                        <Button className="mt-4">Start shopping</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="p-6">
                          <div className="flex flex-wrap justify-between items-start gap-3">
                            <div>
                              <p className="text-xs text-gray-400">Order #{order.orderNumber}</p>
                              <p className="font-semibold text-gray-900 mt-1">{formatDate(order.createdAt)}</p>
                              <div className="flex gap-3 mt-2 text-sm text-gray-500">
                                <span>{order.items.length} items</span>
                                <span>•</span>
                                <span>KES {order.total.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {order.status}
                              </span>
                              <Link href={`/order-confirmation?orderId=${order.id}`} className="text-sm font-medium text-primary hover:underline">
                                Track →
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                      {orders.length > 3 && (
                        <div className="px-6 py-4 bg-gray-50 text-center text-sm text-gray-500">
                          + {orders.length - 3} more orders
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {selectedSection === 'saved' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Your wishlist</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Products you've saved</p>
                  </div>
                  {savedProducts.length === 0 ? (
                    <div className="p-10 text-center">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <Heart className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="mt-3 text-gray-500">Your wishlist is empty.</p>
                      <Link href="/shop">
                        <Button className="mt-4">Browse products</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {savedProducts.map((product) => (
                        <div key={product.id} className="p-5 flex items-center gap-4">
                          <div className="h-16 w-16 flex-shrink-0 rounded-xl bg-gray-100 overflow-hidden">
                            <img src={product.image || '/placeholder.png'} alt={product.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-sm text-gray-500 mt-0.5">KES {product.price.toLocaleString()}</p>
                          </div>
                          <Link href={`/product/${product.id}`} className="shrink-0 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary/20 transition">
                            View
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedSection === 'kyc' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">KYC & verification</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Account security & compliance</p>
                  </div>
                  <div className="p-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="rounded-xl border border-gray-100 p-4">
                        <p className="text-xs text-gray-400">Phone verification</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-medium">{profile?.phone ? '✓ Verified' : 'Not verified'}</p>
                          {!profile?.phone && (
                            <Link href="/profile/edit" className="text-xs text-primary">Add</Link>
                          )}
                        </div>
                      </div>
                      <div className="rounded-xl border border-gray-100 p-4">
                        <p className="text-xs text-gray-400">Address</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-medium">{profile?.address ? 'On file' : 'Missing'}</p>
                          {!profile?.address && (
                            <Link href="/profile/edit" className="text-xs text-primary">Add</Link>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
                      <strong>Note:</strong> Providing accurate KYC information helps speed up checkout and secure your account.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
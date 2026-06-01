'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, ShoppingCart, DollarSign, Package, AlertCircle, MessageCircle, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DashboardMetrics {
  metrics?: {
    pageViews: number;
    uniqueVisitors: number;
    totalEvents: number;
    avgEventsPerVisitor: number;
    chatClicks: number;
    subscriberCount: number;
  };
  sales?: {
    totalRevenue: number;
    totalOrders: number;
    totalItems: number;
    avgOrderValue: number;
  };
  payments?: {
    totalAmount: number;
    totalCount: number;
    avgAmount: number;
    byMethod: Record<string, number>;
  };
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardMetrics>({});
  const [selectedDays, setSelectedDays] = useState(30);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`/api/admin/analytics?type=dashboard&days=${selectedDays}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setData(result.data);
        }
        // fetch role info
        try {
          const meRes = await fetch('/api/admin/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (meRes.ok) {
            const me = await meRes.json();
            setIsSuperAdmin(!!me.data.isSuperAdmin);
          }
        } catch (err) {
          /* ignore */
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedDays]);

  const stats = [
    {
      title: 'Total Revenue',
      value: `KES ${(data.sales?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Total Orders',
      value: data.sales?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Visits',
      value: data.metrics?.pageViews || 0,
      icon: TrendingUp,
      color: 'text-violet-600 bg-violet-100',
    },
    {
      title: 'Unique Visitors',
      value: data.metrics?.uniqueVisitors || 0,
      icon: Users,
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  const paymentChartData = data.payments?.byMethod
    ? Object.entries(data.payments.byMethod).map(([method, amount]) => ({
        name: method,
        value: amount,
      }))
    : [];

  const COLORS = ['#D4A574', '#E8C0A0', '#9B8B7E'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back to Ajabu Beads Admin Portal</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">View analytics for a specific range.</p>
        </div>
        <div className="inline-flex flex-wrap gap-2">
          {[{ days: 30, label: 'This month' }, { days: 90, label: 'Last 3 months' }, { days: 365, label: 'This year' }].map((option) => (
            <button
              key={option.days}
              onClick={() => setSelectedDays(option.days)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedDays === option.days
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background border border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'Mon', sales: 4000 },
                  { name: 'Tue', sales: 3000 },
                  { name: 'Wed', sales: 2000 },
                  { name: 'Thu', sales: 2780 },
                  { name: 'Fri', sales: 1890 },
                  { name: 'Sat', sales: 2390 },
                  { name: 'Sun', sales: 3490 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#D4A574" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: KES ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No payment data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Website Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Page Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.metrics?.pageViews || 0}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.metrics?.uniqueVisitors || 0}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.metrics?.totalEvents || 0}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Chat Button Clicks</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.metrics?.chatClicks || 0}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.metrics?.subscriberCount || 0}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Avg Events/Visitor</p>
              <p className="text-2xl font-bold text-gray-900">
                {(data.metrics?.avgEventsPerVisitor || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Test Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <a href="/admin/products" className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-primary hover:bg-primary/5 transition">
              <p className="text-sm text-gray-500">Products</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">Product catalog</p>
            </a>
            <a href="/admin/orders" className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-primary hover:bg-primary/5 transition">
              <p className="text-sm text-gray-500">Orders</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">Order management</p>
            </a>
            <a href="/admin/customers" className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-primary hover:bg-primary/5 transition">
              <p className="text-sm text-gray-500">Customers</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">Registered users</p>
            </a>
            <a href="/admin/settings" className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-primary hover:bg-primary/5 transition">
              <p className="text-sm text-gray-500">Settings</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">Payment & site config</p>
            </a>
            <a href="/admin/blog" className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-primary hover:bg-primary/5 transition">
              <p className="text-sm text-gray-500">Blog</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">Blog editor</p>
            </a>
            <a href="/admin/media" className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-primary hover:bg-primary/5 transition">
              <p className="text-sm text-gray-500">Media</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">Upload assets</p>
            </a>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Test Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <a href="/admin/products" className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-primary hover:bg-primary/5 transition">
              <p className="text-sm text-gray-500">Products</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">Product catalog</p>
            </a>
            <a href="/admin/orders" className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-primary hover:bg-primary/5 transition">
              <p className="text-sm text-gray-500">Orders</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">Order management</p>
            </a>
            <a href="/admin/customers" className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-primary hover:bg-primary/5 transition">
              <p className="text-sm text-gray-500">Customers</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">Registered users</p>
            </a>
            <a href="/admin/settings" className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-primary hover:bg-primary/5 transition">
              <p className="text-sm text-gray-500">Settings</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">Payment & config</p>
            </a>
            <a href="/admin/blog" className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-primary hover:bg-primary/5 transition">
              <p className="text-sm text-gray-500">Blog</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">Blog editor</p>
            </a>
            <a href="/admin/media" className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-primary hover:bg-primary/5 transition">
              <p className="text-sm text-gray-500">Media</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">Upload assets</p>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Super Admin Section */}
      {isSuperAdmin && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">User Management</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">Manage all users</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Site Settings</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">Global configuration</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Danger Zone</p>
                  <p className="text-lg font-bold text-red-600 mt-1">Critical operations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

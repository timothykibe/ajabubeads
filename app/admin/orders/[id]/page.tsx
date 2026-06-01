'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statusLabels: Record<string, { label: string; variant: string }> = {
  PENDING: { label: 'Pending', variant: 'bg-yellow-100 text-yellow-700' },
  CONFIRMED: { label: 'Confirmed', variant: 'bg-blue-100 text-blue-700' },
  PROCESSING: { label: 'Processing', variant: 'bg-orange-100 text-orange-700' },
  SHIPPED: { label: 'Shipped', variant: 'bg-sky-100 text-sky-700' },
  DELIVERED: { label: 'Delivered', variant: 'bg-green-100 text-green-700' },
  CANCELLED: { label: 'Cancelled', variant: 'bg-red-100 text-red-700' },
};

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`/api/admin/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || 'Unable to load order');
        }
        setOrder(result.data);
        setSelectedStatus(result.data.status || 'PENDING');
      } catch (err: any) {
        setError(err.message || 'Unable to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async () => {
    if (!order || !selectedStatus) return;
    setSaving(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: selectedStatus }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Unable to update status');
      }
      setOrder(result.data);
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-gray-600">Loading order details…</div>;
  }

  if (!order) {
    return <div className="py-24 text-center text-red-600">{error || 'Order not found'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft size={16} /> Back to orders
          </Link>
          <h1 className="text-3xl font-bold mt-3">Order {order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">Customer: {order.firstName} {order.lastName}</p>
        </div>
        <div className="inline-flex items-center gap-2 text-sm">
          <span className={`${statusLabels[order.status]?.variant || 'bg-gray-100 text-gray-700'} rounded-full px-3 py-1`}> 
            {statusLabels[order.status]?.label || order.status}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><strong>Name:</strong> {order.firstName} {order.lastName}</p>
            <p><strong>Email:</strong> {order.email}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Address:</strong> {order.address}, {order.city}, {order.postalCode}, {order.country}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment & Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
            <p><strong>Subtotal:</strong> KES {order.subtotal.toLocaleString()}</p>
            <p><strong>Shipping:</strong> KES {order.shipping.toLocaleString()}</p>
            <p><strong>Tax:</strong> KES {order.tax.toLocaleString()}</p>
            <p className="text-lg font-semibold">Total: KES {order.total.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items?.map((item: any) => (
              <div key={item.id} className="rounded-xl border border-border p-4">
                <div className="flex items-start gap-4">
                  <img src={item.product?.images?.[0] || '/placeholder.png'} alt={item.product?.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold">{item.product?.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="text-sm text-muted-foreground">Price: KES {item.price.toLocaleString()}</p>
                    {item.color && <p className="text-sm text-muted-foreground">Color: {item.color}</p>}
                    {item.size && <p className="text-sm text-muted-foreground">Size: {item.size}</p>}
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Line total</p>
                    <p className="font-semibold">KES {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(statusLabels).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedStatus(key)}
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${selectedStatus === key ? 'border-primary bg-primary/10' : 'border-border bg-background hover:border-primary hover:bg-primary/5'}`}
              >
                <div className="font-semibold">{value.label}</div>
                <div className="text-xs text-muted-foreground">{key}</div>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Button onClick={handleUpdateStatus} disabled={saving}>
              {saving ? 'Saving…' : `Update status to ${selectedStatus}`}
            </Button>
            <Button variant="outline" onClick={() => router.push('/admin/orders')}>
              Back to orders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type Order = {
  id: string;
  orderNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

export default function OrderConfirmationClient() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Order ID not found');
        setLoading(false);
        return;
      }

      try {
        const guestToken = localStorage.getItem('guestCheckoutToken');
        const response = await fetch(`/api/orders/guest/${orderId}`, {
          headers: {
            'X-Guest-Token': guestToken || '',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }

        const data = await response.json();
        setOrder(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const estimatedDelivery = order
    ? new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
        'en-KE',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      )
    : '';

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header cartCount={0} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 text-primary mx-auto animate-spin" />
            <p className="text-muted-foreground">Loading order confirmation...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header cartCount={0} />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4 max-w-md">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">Order Not Found</h1>
            <p className="text-muted-foreground">{error || 'Unable to load order details'}</p>
            <Link href="/shop">
              <Button>Back to Shop</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header cartCount={0} />
      <div className="flex-1 py-12 md:py-20 px-4 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <div className="relative w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-serif font-bold">Thank You!</h1>
            <p className="text-lg text-muted-foreground">Your order has been successfully placed</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 space-y-6 text-left">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="text-2xl font-bold text-primary">#{order.orderNumber}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-b border-border py-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Order Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <p className="font-medium capitalize">{order.status}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Estimated Delivery</p>
                <p className="font-medium">{estimatedDelivery}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Amount</p>
              <p className="text-2xl font-bold text-primary">KES {order.total.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-3">What's Next?</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                  <div>
                    <p className="font-medium">Payment Confirmed</p>
                    <p className="text-muted-foreground text-xs">Your M-Pesa payment has been processed</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary text-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="font-medium">Order Processing</p>
                    <p className="text-muted-foreground text-xs">Your items are being carefully prepared and packaged</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary text-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="font-medium">Shipped</p>
                    <p className="text-muted-foreground text-xs">Track your order with the tracking number sent via email</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary text-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">4</div>
                  <div>
                    <p className="font-medium">Delivered</p>
                    <p className="text-muted-foreground text-xs">Receive and enjoy your beautiful Ajabu Beads</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

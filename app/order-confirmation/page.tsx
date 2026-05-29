import { Suspense } from 'react';
import OrderConfirmationClient from './order-confirmation-client';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading order confirmation...</div>}>
      <OrderConfirmationClient />
    </Suspense>
  );
}

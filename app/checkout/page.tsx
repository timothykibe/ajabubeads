'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ChevronRight, Phone, Lock, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ajabuCart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [paymentMethod, setPaymentMethod] = useState<'MPESA' | 'CYBERSOURCE' | 'PICKUP'>('MPESA');
  const [orderType, setOrderType] = useState<'DELIVERY' | 'SELF_PICKUP'>('DELIVERY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [mpesaErrors, setMpesaErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [guestToken, setGuestToken] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const generateGuestToken = () => {
    if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }
    return `guest_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
  };

  const ensureGuestToken = () => {
    let token = guestToken;
    if (!token) {
      token = generateGuestToken();
      localStorage.setItem('guestCheckoutToken', token);
      setGuestToken(token);
    }
    return token;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const accessToken = localStorage.getItem('accessToken');
    setIsAuthenticated(!!accessToken);

    let token = localStorage.getItem('guestCheckoutToken');
    if (!token) {
      token = generateGuestToken();
      localStorage.setItem('guestCheckoutToken', token);
    }
    setGuestToken(token);
  }, []);

  // Form States
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Kenya',
  });

  const [mpesaData, setMpesaData] = useState({
    phoneNumber: '',
    mpesaCode: '',
  });

  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = orderType === 'SELF_PICKUP' ? 0 : subtotal > 5000 ? 0 : 500;
  const tax = Math.round(subtotal * 0.16);
  const total = subtotal + shipping + tax;

  const availablePaymentMethods = orderType === 'SELF_PICKUP'
    ? (['PICKUP', 'MPESA', 'CYBERSOURCE'] as const)
    : (['MPESA', 'CYBERSOURCE'] as const);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMpesaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMpesaData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const validateShippingForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    // else if (formData.phone.trim().length < 9) newErrors.phone = 'Phone number must be at least 10 digits';
    if (orderType === 'DELIVERY' && !formData.address.trim()) newErrors.address = 'Address is required';
    if (orderType === 'DELIVERY' && !formData.city.trim()) newErrors.city = 'City is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateShippingForm()) return;

    setIsProcessing(true);
    setGeneralError('');

    try {
      // Prepare order items from cart
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        color: item.selectedColor,
        size: item.selectedSize,
      }));

      // Call API to create order
      const token = ensureGuestToken();
      const response = await fetch('/api/orders/guest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Guest-Token': token,
        },
        body: JSON.stringify({
          items: orderItems,
          shippingData: formData,
          paymentMethod,
          orderType,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }

      const data = await response.json();
      setOrderId(data.data.id);
      setStep('payment');
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Order creation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const validateMpesaForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!mpesaData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (mpesaData.phoneNumber.trim().length < 9) {
      newErrors.phoneNumber = 'Phone number must be at least 10 digits';
    } 
    // we dont have +254 in the input 
    // else if (!/^\+?254\d{9}$|^0\d{9}$/.test(mpesaData.phoneNumber.trim())) {
    //   newErrors.phoneNumber = 'Invalid Kenyan phone number format';
    // }
    
    setMpesaErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMpesaPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateMpesaForm()) {
      setShowMpesaModal(true);
    }
  };

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setGeneralError('');

    try {
      const response = await fetch('/api/payments/cybersource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Guest-Token': guestToken || ensureGuestToken(),
        },
        body: JSON.stringify({
          orderId,
          cardNumber: cardData.cardNumber.replace(/\s+/g, ''),
          expiryMonth: cardData.expiryMonth,
          expiryYear: cardData.expiryYear,
          cvv: cardData.cvv,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Card payment failed');

      setStep('confirmation');
      localStorage.removeItem('ajabuCart');
      setTimeout(() => router.push(`/order-confirmation?orderId=${orderId}`), 2000);
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Card payment failed');
      console.error('Card payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePickupConfirmation = async () => {
    if (!orderId) {
      setGeneralError('Order ID is missing');
      return;
    }

    setIsProcessing(true);
    setGeneralError('');

    try {
      setStep('confirmation');
      localStorage.removeItem('ajabuCart');
      setTimeout(() => router.push(`/order-confirmation?orderId=${orderId}`), 1000);
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Failed to confirm pickup order');
      console.error('Pickup confirmation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateMpesaPrompt = async () => {
    if (!orderId) {
      setMpesaErrors({ general: 'Order ID not found' });
      return;
    }

    setIsProcessing(true);
    setMpesaErrors({});

    try {
      // Call M-Pesa initiate endpoint
      const response = await fetch('/api/payments/mpesa/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Guest-Token': guestToken || ensureGuestToken(),
        },
        body: JSON.stringify({
          orderId: orderId,
          phoneNumber: mpesaData.phoneNumber.startsWith('254')
            ? mpesaData.phoneNumber
            : `254${mpesaData.phoneNumber}`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send M-Pesa prompt');
      }

      const data = await response.json();
      setCheckoutRequestId(data.data.checkoutRequestId);

      // Show alert that M-Pesa prompt was sent
      alert(
        `M-Pesa prompt sent to +${mpesaData.phoneNumber}\n\nEnter your M-Pesa PIN to complete the payment of KES ${total.toLocaleString()}`
      );
    } catch (error) {
      setMpesaErrors({
        general: error instanceof Error ? error.message : 'Failed to send M-Pesa prompt',
      });
      console.error('M-Pesa initiate error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!mpesaData.mpesaCode.trim()) {
      setMpesaErrors({ code: 'Transaction code is required' });
      return;
    }
    if (mpesaData.mpesaCode.trim().length < 10) {
      setMpesaErrors({ code: 'Transaction code must be at least 10 characters' });
      return;
    }
    setMpesaErrors({});

    setIsProcessing(true);

    try {
      // Verify payment with backend
      const response = await fetch('/api/payments/mpesa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Guest-Token': guestToken || ensureGuestToken(),
        },
        body: JSON.stringify({
          orderId: orderId,
          transactionCode: mpesaData.mpesaCode,
          checkoutRequestId: checkoutRequestId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to verify payment');
      }

      // Payment successful
      setStep('confirmation');
      setShowMpesaModal(false);

      // Clear cart and guest token
      localStorage.removeItem('ajabuCart');

      // Redirect to order confirmation after 3 seconds
      setTimeout(() => {
        router.push(`/order-confirmation?orderId=${orderId}`);
      }, 3000);
    } catch (error) {
      setMpesaErrors({
        general: error instanceof Error ? error.message : 'Payment verification failed',
      });
      console.error('Payment verification error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header cartCount={0} />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Cart is Empty</h1>
            <p className="text-muted-foreground">Add items to your cart before checkout</p>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header cartCount={cartItems.length} />

      {/* Progress Indicator */}
      <div className="bg-secondary/20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="flex items-center justify-center gap-2 md:gap-4">
            <div
              className={`flex items-center gap-2 ${
                step === 'shipping' || step === 'payment' || step === 'confirmation'
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                1
              </div>
              <span className="text-sm font-medium hidden md:inline">Shipping</span>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground" />

            <div
              className={`flex items-center gap-2 ${
                step === 'payment' || step === 'confirmation'
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step === 'payment' || step === 'confirmation'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                2
              </div>
              <span className="text-sm font-medium hidden md:inline">Payment</span>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground" />

            <div
              className={`flex items-center gap-2 ${
                step === 'confirmation' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step === 'confirmation'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                3
              </div>
              <span className="text-sm font-medium hidden md:inline">Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8 md:py-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              {step === 'shipping' && (
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                  <h2 className="text-2xl font-serif font-bold">Shipping Information</h2>

                  {generalError && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">{generalError}</p>
                    </div>
                  )}

                  <form onSubmit={handleContinueToPayment} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 ${
                            errors.firstName ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                          }`}
                          required
                        />
                        {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 ${
                            errors.lastName ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                          }`}
                          required
                        />
                        {errors.lastName && <p className="text-destructive text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 ${
                          errors.email ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                        }`}
                        required
                      />
                      {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 ${
                          errors.phone ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                        }`}
                        required
                      />
                      {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                      <label className="block text-sm font-medium">Order Type</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setOrderType('DELIVERY');
                            setPaymentMethod('MPESA');
                          }}
                          className={`rounded-lg border p-3 text-left transition ${orderType === 'DELIVERY' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/60'}`}
                        >
                          <div className="font-semibold">Delivery</div>
                          <div className="text-xs text-muted-foreground">Home delivery with shipping fee rules</div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOrderType('SELF_PICKUP');
                            setPaymentMethod('PICKUP');
                          }}
                          className={`rounded-lg border p-3 text-left transition ${orderType === 'SELF_PICKUP' ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/60'}`}
                        >
                          <div className="font-semibold">Self Pickup</div>
                          <div className="text-xs text-muted-foreground">Collect from our store with zero shipping</div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 ${
                          errors.address ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                        }`}
                        required={orderType === 'DELIVERY'}
                      />
                      {errors.address && <p className="text-destructive text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 ${
                            errors.city ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'
                          }`}
                          required={orderType === 'DELIVERY'}
                        />
                        {errors.city && <p className="text-destructive text-sm mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Country
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option>Kenya</option>
                          <option>Uganda</option>
                          <option>Tanzania</option>
                        </select>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                      <label className="block text-sm font-medium">Payment method</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {availablePaymentMethods.map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setPaymentMethod(method)}
                            className={`rounded-lg border p-3 text-left transition ${paymentMethod === method ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/60'}`}
                          >
                            <div className="font-semibold">
                              {method === 'MPESA' ? 'M-Pesa' : method === 'CYBERSOURCE' ? 'Card' : 'Pay at Pickup'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {method === 'MPESA'
                                ? 'Mobile money prompt'
                                : method === 'CYBERSOURCE'
                                ? 'Secure card payment'
                                : 'Pay when you collect your order at our store'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" className="w-full py-6 text-base" disabled={isProcessing}>
                      {isProcessing ? 'Creating Order...' : 'Continue to Payment'}
                    </Button>
                  </form>
                </div>
              )}

              {step === 'payment' && (
                <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                  <h2 className="text-2xl font-serif font-bold">Payment Method</h2>

                  {generalError && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">{generalError}</p>
                    </div>
                  )}

                  <div className="bg-secondary/20 border border-primary rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-6 h-6 text-primary" />
                      <h3 className="font-semibold text-lg">
                        {paymentMethod === 'MPESA'
                          ? 'M-Pesa Payment'
                          : paymentMethod === 'CYBERSOURCE'
                          ? 'Card Payment'
                          : 'Pay at Pickup'}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {paymentMethod === 'MPESA'
                        ? 'Secure mobile money payment. You will receive a prompt on your phone to complete the transaction.'
                        : paymentMethod === 'CYBERSOURCE'
                        ? 'Use a debit or credit card to complete the order securely.'
                        : 'Confirm your pickup order now. You can pay when you collect it from our store.'}
                    </p>
                  </div>

                  {paymentMethod === 'CYBERSOURCE' ? (
                    <form onSubmit={handleCardPayment} className="space-y-6">
                      <div className="grid gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Card Number</label>
                          <input type="text" name="cardNumber" value={cardData.cardNumber} onChange={handleCardInputChange} placeholder="4111 1111 1111 1111" className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Expiry Month</label>
                            <input type="text" name="expiryMonth" value={cardData.expiryMonth} onChange={handleCardInputChange} placeholder="08" maxLength={2} className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" required />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Expiry Year</label>
                            <input type="text" name="expiryYear" value={cardData.expiryYear} onChange={handleCardInputChange} placeholder="28" maxLength={2} className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" required />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">CVV</label>
                          <input type="password" name="cvv" value={cardData.cvv} onChange={handleCardInputChange} placeholder="123" maxLength={4} className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary" required />
                        </div>
                      </div>
                      <Button type="submit" className="w-full py-6 text-base" disabled={isProcessing}>{isProcessing ? 'Processing Card...' : 'Pay with Card'}</Button>
                      <Button type="button" variant="outline" onClick={() => setStep('shipping')} className="w-full">Back to Shipping</Button>
                    </form>
                  ) : paymentMethod === 'MPESA' ? (
                    <form onSubmit={handleMpesaPayment} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number (M-Pesa) *</label>
                        <div className="flex gap-2">
                          <span className="flex items-center px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground">+254</span>
                          <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="712345678"
                            value={mpesaData.phoneNumber}
                            onChange={handleMpesaInputChange}
                            maxLength={10}
                            className={`flex-1 px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 ${mpesaErrors.phoneNumber ? 'border-destructive focus:ring-destructive' : 'border-border focus:ring-primary'}`}
                            required
                          />
                        </div>
                        {mpesaErrors.phoneNumber && <p className="text-destructive text-sm mt-1">{mpesaErrors.phoneNumber}</p>}
                        <p className="text-xs text-muted-foreground mt-2">Enter your M-Pesa registered phone number (without +254)</p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                        <p className="text-sm text-blue-900"><strong>How M-Pesa Payment Works:</strong></p>
                        <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                          <li>Click "Send M-Pesa Prompt" below</li>
                          <li>You will receive an M-Pesa prompt on your phone</li>
                          <li>Enter your M-Pesa PIN to complete payment</li>
                          <li>You will receive a confirmation code</li>
                          <li>Enter the code to verify payment</li>
                        </ol>
                      </div>

                      <Button type="submit" className="w-full py-6 text-base">Send M-Pesa Prompt</Button>
                      <Button type="button" variant="outline" onClick={() => setStep('shipping')} className="w-full">Back to Shipping</Button>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-secondary/10 rounded-lg p-4 text-sm text-muted-foreground">
                        <p className="font-medium text-base">Pickup Instructions</p>
                        <p>We will confirm your order and send you pickup details via email and WhatsApp shortly.</p>
                        <p className="mt-2">Collect your order from our store location during business hours.</p>
                      </div>
                      <Button onClick={handlePickupConfirmation} className="w-full py-6 text-base" disabled={isProcessing}>{isProcessing ? 'Confirming...' : 'Confirm Pickup Order'}</Button>
                      <Button type="button" variant="outline" onClick={() => setStep('shipping')} className="w-full">Back to Shipping</Button>
                    </div>
                  )}
                </div>
              )}

              {step === 'confirmation' && (
                <div className="bg-card border border-green-200 rounded-lg p-6 text-center space-y-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-green-600">
                      Payment Successful!
                    </h2>
                    <p className="text-muted-foreground">
                      Your order has been placed and confirmed. You will receive an email confirmation shortly.
                    </p>
                  </div>

                  <div className="bg-secondary/20 rounded-lg p-4 text-left space-y-2 text-sm">
                    <p>
                      <strong>Order ID:</strong> #{orderId?.slice(-8).toUpperCase() || 'Loading...'}
                    </p>
                    <p>
                      <strong>Total Amount:</strong> KES {total.toLocaleString()}
                    </p>
                    <p>
                      <strong>Order Type:</strong> {orderType === 'SELF_PICKUP' ? 'Self Pickup' : 'Delivery'}
                    </p>
                    <p>
                      <strong>Payment Method:</strong> {paymentMethod === 'PICKUP' ? 'Pay at Pickup' : paymentMethod === 'MPESA' ? 'M-Pesa' : 'Card'}
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Redirecting to order confirmation...
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 space-y-6 sticky top-24">
                <h3 className="font-serif text-lg font-bold">Order Summary</h3>

                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b border-border">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-muted rounded overflow-hidden">
                        <Image
                          src={item.image || item.images?.[0] || '/products/bracelet-1.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium line-clamp-1">{item.name}</p>
                        <p className="text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-primary font-semibold">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm border-t border-border pt-4">
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

                  <div className="border-t border-border pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary text-lg">
                      KES {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Security Info */}
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-3 rounded">
                  <Lock className="w-4 h-4" />
                  <span>Your payment is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* M-Pesa Modal */}
      {showMpesaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg p-6 max-w-md w-full space-y-6">
            {mpesaErrors.general && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-xs text-destructive">{mpesaErrors.general}</p>
              </div>
            )}
            {!isProcessing && !mpesaData.mpesaCode ? (
              <>
                <div className="text-center space-y-2">
                  <h3 className="font-serif text-xl font-bold">Confirm M-Pesa Payment</h3>
                  <p className="text-muted-foreground text-sm">
                    Click below to send M-Pesa prompt to +254{mpesaData.phoneNumber}
                  </p>
                </div>

                <div className="bg-secondary/20 p-4 rounded text-center">
                  <p className="text-sm text-muted-foreground mb-2">Amount to Pay</p>
                  <p className="text-2xl font-bold text-primary">
                    KES {total.toLocaleString()}
                  </p>
                </div>

                <Button
                  onClick={simulateMpesaPrompt}
                  disabled={isProcessing}
                  className="w-full py-6"
                >
                  {isProcessing ? 'Sending...' : 'Send M-Pesa Prompt'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMpesaModal(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <h3 className="font-serif text-xl font-bold">Enter M-Pesa Code</h3>
                  <p className="text-muted-foreground text-sm">
                    Enter your M-Pesa transaction code from the SMS confirmation
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    name="mpesaCode"
                    placeholder="e.g., MZD1234567"
                    value={mpesaData.mpesaCode}
                    onChange={handleMpesaInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    minLength={10}
                  />
                  {mpesaData.mpesaCode && mpesaData.mpesaCode.length < 10 && (
                    <p className="text-destructive text-sm mt-2">Transaction code must be at least 10 characters</p>
                  )}
                </div>

                <Button
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="w-full py-6"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Payment'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowMpesaModal(false);
                    setMpesaData({ ...mpesaData, mpesaCode: '' });
                  }}
                  className="w-full"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

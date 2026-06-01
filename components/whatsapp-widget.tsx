'use client';

import React, { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [kycSubmitted, setKycSubmitted] = useState(false);
  const [submittingKyc, setSubmittingKyc] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAuthenticated(!!localStorage.getItem('accessToken'));
    }
  }, []);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254726862144';
  const templateMessage = 'Hello Ajabu, I would like help with my order. My name is:';
  const whatsappMessage = `${templateMessage} ${messageInput}`.trim();
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const logChatClick = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ eventType: 'chat_button_click' }),
      });
    } catch (err) {
      console.error('Unable to log chat click', err);
    }
  };

  const handleSubmitKyc = async () => {
    if (!name.trim() || !phone.trim()) {
      setStatusMessage('Please provide your name and phone number to continue.');
      return;
    }

    setSubmittingKyc(true);
    setStatusMessage('Sending your request...');

    try {
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'kyc_request',
          eventData: {
            name,
            email,
            phone,
            message: messageInput,
            page: typeof window !== 'undefined' ? window.location.pathname : undefined,
          },
        }),
      });

      setKycSubmitted(true);
      setStatusMessage('Thanks! Your request has been recorded and admin will follow up.');
    } catch (err) {
      console.error('KYC request failed', err);
      setStatusMessage('Unable to send request. Please try again.');
    } finally {
      setSubmittingKyc(false);
    }
  };

  // Hide on admin pages
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-2xl z-40 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-primary text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Ajabu Support</h3>
                <p className="text-sm opacity-90">We usually reply instantly</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-primary/80"
              >
                <X size={18} />
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-4 max-h-80 overflow-auto">
            {!isAuthenticated && !kycSubmitted ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
                  Please share your details so our team can verify your request and help with KYC.
                </div>
                <div className="grid gap-3">
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email (optional)"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Phone number"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <textarea
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    placeholder="Tell us what you need help with..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
                  />
                </div>
                {statusMessage && <p className="text-sm text-muted-foreground">{statusMessage}</p>}
                <Button
                  onClick={handleSubmitKyc}
                  disabled={submittingKyc}
                  className="w-full"
                >
                  {submittingKyc ? 'Sending...' : 'Submit KYC Request'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">How can we help you today?</p>
                </div>

                <label className="block text-sm font-medium text-gray-700">Your Message</label>
                <input
                  value={messageInput}
                  onChange={(event) => setMessageInput(event.target.value)}
                  placeholder="Hi, I need help with..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-semibold">Quick replies:</p>
                  {[
                    { label: 'Order Status', text: 'Hello Ajabu, I would like help with my order status.' },
                    { label: 'Payment Help', text: 'Hello Ajabu, I would like help with payment options.' },
                    { label: 'Product Info', text: 'Hello Ajabu, I want more information about your products.' },
                    { label: 'Other Questions', text: 'Hello Ajabu, I have another question.' },
                  ].map((quick) => (
                    <button
                      key={quick.label}
                      onClick={() => {
                        setMessageInput(quick.text);
                        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(quick.text)}`, '_blank');
                      }}
                      className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm text-primary font-medium transition"
                    >
                      {quick.label}
                    </button>
                  ))}
                </div>

                {statusMessage && <p className="text-sm text-muted-foreground">{statusMessage}</p>}

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block"
                >
                  <Button className="w-full bg-green-500 hover:bg-green-600 gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.99 1.511c-2.751 1.587-4.335 4.174-4.33 6.853 0 1.524.378 3.008 1.084 4.337l-1.153 4.208 4.312-1.129c1.266.699 2.697 1.064 4.133 1.064h.004c5.462 0 9.9-4.438 9.9-9.9 0-2.641-.991-5.131-2.791-7.012A9.83 9.83 0 0011.968 5.8c0-.274.007-.548.019-.821"/>
                    </svg>
                    Chat on WhatsApp
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <Button
        onClick={async () => {
          if (!isOpen) await logChatClick();
          setIsOpen(!isOpen);
        }}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl bg-primary hover:bg-primary/90 text-white z-50 transition-all duration-300"
        size="lg"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>
    </>
  );
}

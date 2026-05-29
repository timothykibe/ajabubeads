'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NEWSLETTER_POPUP_DISMISS_KEY = 'ajabuNewsletterPopupDismissedAt';
const NEWSLETTER_SUBSCRIBED_KEY = 'ajabuNewsletterSubscribed';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'sending'>('idle');
  const [message, setMessage] = useState('');

  const shouldShowPopup = () => {
    if (typeof window === 'undefined') return false;
    if (localStorage.getItem(NEWSLETTER_SUBSCRIBED_KEY) === 'true') return false;

    const dismissedAt = Number(localStorage.getItem(NEWSLETTER_POPUP_DISMISS_KEY));
    if (!dismissedAt || Number.isNaN(dismissedAt)) return true;

    const cooldownMs = 7 * 24 * 60 * 60 * 1000; // 7 days
    return Date.now() - dismissedAt > cooldownMs;
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (shouldShowPopup()) {
        setIsOpen(true);
      }
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('sending');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Subscribed successfully! Check your email for confirmation.');
        setEmail('');
        localStorage.setItem(NEWSLETTER_SUBSCRIBED_KEY, 'true');
        localStorage.setItem(NEWSLETTER_POPUP_DISMISS_KEY, Date.now().toString());
        setTimeout(() => setIsOpen(false), 900);
      } else {
        const data = await response.json();
        setStatus('error');
        setMessage(data?.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Unable to subscribe at the moment. Please try again later.');
    }
  };

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem(NEWSLETTER_POPUP_DISMISS_KEY, Date.now().toString());
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Join the community</p>
            <h2 className="mt-3 text-3xl font-bold">Never miss a new collection.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Subscribe to receive exclusive offers, artisan stories, and early access to our newest beads and jewelry.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={closePopup}>
            <X size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Enter your email"
            required
            className="min-w-0 flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <Button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Subscribe'}
          </Button>
        </form>

        {message ? (
          <p className={`mt-4 text-sm ${status === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}

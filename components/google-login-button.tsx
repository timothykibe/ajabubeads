'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleLoginButtonProps {
  onSuccess: (result: { credential?: string; accessToken?: string; refreshToken?: string; user?: any }) => void;
  onError?: (message: string) => void;
  label?: string;
}

export default function GoogleLoginButton({ onSuccess, onError, label = 'Continue with Google' }: GoogleLoginButtonProps) {
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const [fallbackOpen, setFallbackOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || typeof window === 'undefined') return;

    if (!document.getElementById('google-client-script')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.id = 'google-client-script';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [clientId]);

  useEffect(() => {
    if (!clientId || typeof window === 'undefined') return;

    const initializeGoogleButton = () => {
      if (!window.google || !googleButtonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: any) => {
          if (response?.credential) {
            onSuccess({ credential: response.credential });
          } else {
            onError?.('Google login failed');
          }
        },
        ux_mode: 'popup',
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'signin_with',
      });
    };

    if (window.google) {
      initializeGoogleButton();
      return;
    }

    const script = document.getElementById('google-client-script');
    if (script) {
      script.addEventListener('load', initializeGoogleButton);
      return () => script.removeEventListener('load', initializeGoogleButton);
    }
  }, [clientId, onSuccess, onError]);

  const handleFallbackSignIn = async () => {
    if (!email.trim()) {
      onError?.('Email is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || email.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        onError?.(data.error || 'Google login failed');
        return;
      }
      if (data?.data?.accessToken) {
          onSuccess({ accessToken: data.data.accessToken, refreshToken: data.data.refreshToken, user: data.data.user });
      } else {
        onError?.('Google login did not return a token');
      }
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  if (!clientId) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setFallbackOpen((prev) => !prev)}
          className="w-full rounded-full border border-border bg-white px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted"
        >
          {label}
        </button>
        {fallbackOpen && (
          <div className="space-y-3 rounded-3xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              No Google client ID is configured. Use this fallback to sign in with your email for demo mode.
            </p>
            <label className="block text-sm">
              <span className="text-sm font-medium">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="block text-sm">
              <span className="text-sm font-medium">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                type="text"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <button
              type="button"
              onClick={handleFallbackSignIn}
              disabled={loading}
              className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Continue with Google'}
            </button>
          </div>
        )}
      </div>
    );
  }

  return <div ref={googleButtonRef} />;
}

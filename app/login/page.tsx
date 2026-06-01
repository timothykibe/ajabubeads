'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import GoogleLoginButton from '@/components/google-login-button';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/lib/hooks';

// Separate component that uses useSearchParams
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect') || '/';
  const redirect = ['/login', '/register'].includes(rawRedirect) ? '/' : rawRedirect;
  const { login, loginWithGoogle, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
      router.push(redirect);
    }
  }, [redirect, router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    if (!email.trim() || !password.trim()) {
      setFormError('Email and password are required.');
      return;
    }

    const result = await login(email.trim(), password.trim());
    if (result) {
      router.push(redirect);
    }
  };

  const handleGoogleSuccess = async ({ credential, accessToken, refreshToken, user }: { credential?: string; accessToken?: string; refreshToken?: string; user?: any }) => {
    setFormError('');
    try {
      if (credential) {
        const result = await loginWithGoogle(credential);
        if (result) {
          router.push(redirect);
        }
      } else if (accessToken) {
        // fallback demo mode path: store tokens and provided user
        apiClient.setAccessToken(accessToken);
        if (refreshToken) apiClient.setRefreshToken(refreshToken);
        if (user) apiClient.setUser(user);
        router.push(redirect);
      } else {
        setFormError('Google login failed.');
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Google login failed.');
    }
  };

  return (
    <>
      <Header cartCount={0} />
      <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-serif font-bold">Customer Login</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Access your account to save your cart, checkout faster and manage orders.
            </p>
          </div>

          <div className="space-y-4">
            <GoogleLoginButton
              onSuccess={handleGoogleSuccess}
              onError={(message) => setFormError(message)}
            />
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              <span>or continue with email</span>
              <span className="h-px flex-1 bg-border" />
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>

            {(formError || error) && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                {formError || error}
              </div>
            )}

            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Don&apos;t have an account?{' '}
              <Link href={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-primary font-semibold hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

// Main page component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
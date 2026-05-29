'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
}

export default function Header({ cartCount }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const updateAuthState = () => {
      setIsAuthenticated(
        typeof window !== 'undefined' && !!localStorage.getItem('accessToken')
      );
      try {
        const u = localStorage.getItem('user');
        setUser(u ? JSON.parse(u) : null);
      } catch (e) {
        setUser(null);
      }
    };

    updateAuthState();
    window.addEventListener('storage', updateAuthState);
    window.addEventListener('auth-changed', updateAuthState);

    return () => {
      window.removeEventListener('storage', updateAuthState);
      window.removeEventListener('auth-changed', updateAuthState);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Blog', href: '/blog' },
    { label: 'Our Story', href: '/our-journey' },
    { label: 'Visit Us', href: '/visit-us' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between px-4 lg:px-8 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <Image
            src="/logo.png"
            alt="Ajabu Beads Logo"
            width={60}
            height={60}
            className="h-14 w-auto transition-transform group-hover:scale-105"
            priority
          />
          <span className="text-2xl md:text-3xl font-serif font-extrabold text-primary tracking-tight">
            Ajabu Beads
          </span>
        </Link>

        {/* Center Navigation */}
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-all duration-300 relative py-2 ${
                isActive(item.href)
                  ? 'text-primary font-semibold'
                  : 'text-foreground hover:text-primary'
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-md" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-muted rounded-md transition-colors">
            <Search className="w-5 h-5" />
          </button>
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <Link
              href="/account"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name || 'Avatar'} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{(user?.name || user?.email || 'U').charAt(0).toUpperCase()}</span>
              )}
              <span>{user?.name || 'My Account'}</span>
            </Link>
          )}
          <Link
            href="/cart"
            className="relative p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <Image
            src="/logo.png"
            alt="Ajabu Beads Logo"
            width={45}
            height={45}
            className="h-11 w-auto transition-transform group-hover:scale-105"
            priority
          />
          <span className="text-xl font-serif font-extrabold text-primary tracking-tight">Ajabu</span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-2 animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                isActive(item.href)
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-foreground hover:bg-muted hover:text-primary'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {!isAuthenticated ? (
            <div className="space-y-2 pt-2">
              <Link
                href="/login"
                className="block px-4 py-3 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </header>
  );
}

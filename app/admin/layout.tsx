'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [checkedAuth, setCheckedAuth] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
    },
    {
      label: 'Products',
      href: '/admin/products',
      icon: Package,
    },
    {
      label: 'Blog',
      href: '/admin/blog',
      icon: BookOpen,
    },
    {
      label: 'Media',
      href: '/admin/media',
      icon: BookOpen,
    },
    {
      label: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      label: 'Customers',
      href: '/admin/customers',
      icon: Users,
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const normalizedPath = pathname?.replace(/\/+$/, '') ?? '';
  const isLoginPage = normalizedPath === '/admin/login';

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    if (isLoginPage) {
      if (token) {
        router.push('/admin');
      } else {
        setCheckedAuth(true);
      }
      return;
    }

    if (!token) {
      router.push('/admin/login');
      return;
    }

    setCheckedAuth(true);
  }, [normalizedPath, router, isLoginPage]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  if (!checkedAuth) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          'bg-white border-r border-gray-200 transition-all duration-300 flex flex-col',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className={cn(
            'flex items-center gap-3 font-bold text-xl',
            !sidebarOpen && 'justify-center'
          )}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            {sidebarOpen && <span>Ajabu Admin</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-center gap-2"
            size="sm"
          >
            <LogOut size={18} />
            {sidebarOpen && 'Logout'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@ajabubeads.com</p>
            </div>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {!checkedAuth ? (
              <div className="flex items-center justify-center h-48">Checking authentication...</div>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

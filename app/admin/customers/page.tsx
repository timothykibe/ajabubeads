'use client';

import React, { useEffect, useState } from 'react';
import { Users, CheckCircle, ShieldCheck, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isSubscribed: boolean;
  _count: {
    orders: number;
    savedProducts: number;
  };
}

export default function AdminCustomersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Unable to fetch users');
        }
        setUsers((data.data.users || []).filter((user: any) => !user.isAdmin && !user.isSuperAdmin));
      } catch (err: any) {
        setError(err.message || 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getRoleLabel = (user: AdminUser) => {
    if (user.isSuperAdmin) {
      return 'Super Admin';
    }
    if (user.isAdmin) {
      return 'Admin';
    }
    return 'Customer';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">View and manage registered users.</p>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Customer accounts</CardTitle>
              <p className="text-sm text-gray-500">Loaded {users.length} user(s).</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-700 text-sm">
              <Users size={16} />
              Users
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading customers...</div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No customers found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Saved</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.name || '—'}</TableCell>
                      <TableCell>{user._count?.orders ?? 0}</TableCell>
                      <TableCell>{user._count?.savedProducts ?? 0}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {user._count?.orders > 0 && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                              <CheckCircle size={14} />
                              Shopped
                            </span>
                          )}
                          {user.isSubscribed && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-700">
                              <ShieldCheck size={14} />
                              Subscriber
                            </span>
                          )}
                          {!user.isSubscribed && user._count?.orders === 0 && (
                            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                              <XCircle size={14} />
                              New
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleLabel(user)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

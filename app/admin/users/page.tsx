"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

interface User {
  id: string;
  email: string;
  name?: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  savedProducts?: any[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [savedProducts, setSavedProducts] = useState<any[]>([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.data.users || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleRole = async (userId: string, field: 'isAdmin' | 'isSuperAdmin', value: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers((u) => u.map((x) => (x.id === userId ? updated.data : x)));
      } else {
        const err = await res.json();
        console.error(err);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const viewSaved = async (userId: string, email: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/users/${userId}/saved-products`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setSavedProducts(data.data.saved || []);
        setSelectedUserEmail(email);
        setDialogOpen(true);
      } else {
        const err = await res.json();
        console.error(err);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-gray-600">Manage application users and roles</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Super Admin</TableHead>
              <TableHead>Saved</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.isAdmin ? 'Yes' : 'No'}</TableCell>
                <TableCell>{user.isSuperAdmin ? 'Yes' : 'No'}</TableCell>
                <TableCell>{(user.savedProducts && user.savedProducts.length) || 0}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => toggleRole(user.id, 'isAdmin', !user.isAdmin)}>
                      Toggle Admin
                    </Button>
                    <Button size="sm" onClick={() => toggleRole(user.id, 'isSuperAdmin', !user.isSuperAdmin)}>
                      Toggle Super
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => viewSaved(user.id, user.email)}>
                      View Saved
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) { setSavedProducts([]); setSelectedUserEmail(null); } setDialogOpen(open); }}>
        <DialogContent>
          <DialogTitle>Saved Products{selectedUserEmail ? ` — ${selectedUserEmail}` : ''}</DialogTitle>
          <DialogDescription>List of products this user saved (most recent first).</DialogDescription>

          <div className="mt-4 space-y-3">
            {savedProducts.length === 0 && <div className="text-sm text-muted-foreground">No saved products</div>}
            {savedProducts.map((s) => (
              <div key={s.id} className="flex items-center gap-4">
                <img src={s.product?.images?.[0] || '/products/placeholder.jpg'} alt={s.product?.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <div className="font-medium">{s.product?.name}</div>
                  <div className="text-sm text-muted-foreground">KES {s.product?.price?.toLocaleString?.() || s.product?.price}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right">
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

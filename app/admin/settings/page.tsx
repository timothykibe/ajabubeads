"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

type SettingsForm = {
  mpesaConsumerKey: string;
  mpesaConsumerSecret: string;
  mpesaShortcode: string;
  mpesaPasskey: string;
  mpesaCallbackUrl: string;
  cybersourceMerchantKeyId: string;
  cybersourceMerchantSecretKey: string;
  cybersourceWebhookSecret: string;
};

type NewUserForm = {
  email: string;
  name: string;
  password: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
};

const initialFormState: SettingsForm = {
  mpesaConsumerKey: '',
  mpesaConsumerSecret: '',
  mpesaShortcode: '',
  mpesaPasskey: '',
  mpesaCallbackUrl: '',
  cybersourceMerchantKeyId: '',
  cybersourceMerchantSecretKey: '',
  cybersourceWebhookSecret: '',
};

const initialNewUserState: NewUserForm = {
  email: '',
  name: '',
  password: '',
  isAdmin: false,
  isSuperAdmin: false,
};

interface AdminUser {
  id: string;
  email: string;
  name?: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState<SettingsForm>(initialFormState);
  const [activeTab, setActiveTab] = useState('payment');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [newUser, setNewUser] = useState<NewUserForm>(initialNewUserState);
  const [userError, setUserError] = useState('');

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/settings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error('Unable to load settings');
        }
        const data = await res.json();
        setForm({
          mpesaConsumerKey: data.data.mpesaConsumerKey || '',
          mpesaConsumerSecret: data.data.mpesaConsumerSecret || '',
          mpesaShortcode: data.data.mpesaShortcode || '',
          mpesaPasskey: data.data.mpesaPasskey || '',
          mpesaCallbackUrl: data.data.mpesaCallbackUrl || '',
          cybersourceMerchantKeyId: data.data.cybersourceMerchantKeyId || '',
          cybersourceMerchantSecretKey: data.data.cybersourceMerchantSecretKey || '',
          cybersourceWebhookSecret: data.data.cybersourceWebhookSecret || '',
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  useEffect(() => {
    if (activeTab !== 'users') return;

    const loadUsers = async () => {
      setLoadingUsers(true);
      setUserError('');
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || 'Unable to load users');
        }
        setUsers(result.data?.users || []);
      } catch (error: any) {
        setUserError(error.message || 'Failed to load users');
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [activeTab]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setAlert('');
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || 'Failed to save settings');
      }
      setAlert('Settings saved successfully.');
    } catch (error: any) {
      setAlert(error.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Unable to add user');
      }
      setUsers((prev) => [result.data.user, ...prev]);
      setNewUser(initialNewUserState);
    } catch (error: any) {
      setUserError(error.message || 'Failed to add user');
    }
  };

  const handleToggleRole = async (userId: string, role: 'isAdmin' | 'isSuperAdmin', value: boolean) => {
    setUserError('');
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [role]: value }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Unable to update user');
      }
      setUsers((prev) => prev.map((user) => (user.id === userId ? result.data.user : user)));
    } catch (error: any) {
      setUserError(error.message || 'Failed to update user');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Configure payment credentials and manage admin users from one place.
        </p>
      </div>

      <Tabs defaultValue="payment" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>

        <TabsContent value="payment">
          <form onSubmit={handleSubmit} className="grid gap-4">
            {alert && (
              <Alert className="border-green-200 bg-green-50 text-green-700">
                <AlertDescription>{alert}</AlertDescription>
              </Alert>
            )}
            <section className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">M-Pesa Settings</h2>
              <div className="grid gap-4">
                <Input
                  name="mpesaConsumerKey"
                  value={form.mpesaConsumerKey}
                  onChange={handleChange}
                  placeholder="M-Pesa Consumer Key"
                />
                <Input
                  name="mpesaConsumerSecret"
                  value={form.mpesaConsumerSecret}
                  onChange={handleChange}
                  placeholder="M-Pesa Consumer Secret"
                />
                <Input
                  name="mpesaShortcode"
                  value={form.mpesaShortcode}
                  onChange={handleChange}
                  placeholder="M-Pesa Shortcode"
                />
                <Input
                  name="mpesaPasskey"
                  value={form.mpesaPasskey}
                  onChange={handleChange}
                  placeholder="M-Pesa Passkey"
                />
                <Input
                  name="mpesaCallbackUrl"
                  value={form.mpesaCallbackUrl}
                  onChange={handleChange}
                  placeholder="M-Pesa Callback URL"
                />
              </div>
            </section>

            <section className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">CyberSource Settings</h2>
              <div className="grid gap-4">
                <Input
                  name="cybersourceMerchantKeyId"
                  value={form.cybersourceMerchantKeyId}
                  onChange={handleChange}
                  placeholder="CyberSource Merchant Key ID"
                />
                <Input
                  name="cybersourceMerchantSecretKey"
                  value={form.cybersourceMerchantSecretKey}
                  onChange={handleChange}
                  placeholder="CyberSource Merchant Secret Key"
                />
                <Input
                  name="cybersourceWebhookSecret"
                  value={form.cybersourceWebhookSecret}
                  onChange={handleChange}
                  placeholder="CyberSource Webhook Secret"
                />
              </div>
            </section>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={saving || loading}>
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/admin')}>
                Back to dashboard
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid gap-6">
            <section className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Add Admin User</h2>
              {userError && (
                <Alert className="border-red-200 bg-red-50 text-red-700">
                  <AlertDescription>{userError}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleCreateUser} className="grid gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    name="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    placeholder="Email"
                    required
                  />
                  <Input
                    name="name"
                    value={newUser.name}
                    onChange={handleNewUserChange}
                    placeholder="Name"
                  />
                </div>
                <Input
                  name="password"
                  type="password"
                  value={newUser.password}
                  onChange={handleNewUserChange}
                  placeholder="Password"
                  required
                />
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <Checkbox
                      name="isAdmin"
                      checked={newUser.isAdmin}
                      onCheckedChange={(checked) => setNewUser((prev) => ({ ...prev, isAdmin: Boolean(checked) }))}
                    />
                    Admin access
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox
                      name="isSuperAdmin"
                      checked={newUser.isSuperAdmin}
                      onCheckedChange={(checked) => setNewUser((prev) => ({ ...prev, isSuperAdmin: Boolean(checked) }))}
                    />
                    Super admin
                  </label>
                </div>
                <Button type="submit">Create User</Button>
              </form>
            </section>

            <section className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Admin Users</h2>
              {loadingUsers ? (
                <p>Loading users...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Admin</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Super Admin</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{user.name || '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{user.isAdmin ? 'Yes' : 'No'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{user.isSuperAdmin ? 'Yes' : 'No'}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleRole(user.id, 'isAdmin', !user.isAdmin)}
                              >
                                {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleRole(user.id, 'isSuperAdmin', !user.isSuperAdmin)}
                              >
                                {user.isSuperAdmin ? 'Revoke Super' : 'Make Super'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </TabsContent>

        <TabsContent value="info">
          <section className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">General Settings</h2>
            <p className="text-sm text-gray-600">
              Add more store configuration here for site details, support contacts, and environment controls.
            </p>
            <div className="mt-4 grid gap-4">
              <Input placeholder="Store name" disabled />
              <Input placeholder="Support email" disabled />
              <Input placeholder="Store timezone" disabled />
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

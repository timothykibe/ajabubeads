"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setForm(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const body = {
        name: form.name,
        sku: form.sku,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        slug: form.slug,
        images: form.images || [],
        description: form.description,
      };
      const res = await fetch(`/api/admin/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }
      router.push('/admin/products');
    } catch (err: any) {
      alert(err.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <div className="space-y-4 max-w-2xl">
        <Input name="name" placeholder="Name" value={form.name || ''} onChange={handleChange} />
        <Input name="sku" placeholder="SKU" value={form.sku || ''} onChange={handleChange} />
        <Input name="price" placeholder="Price" value={form.price || 0} onChange={handleChange} />
        <Input name="stock" placeholder="Stock" value={form.stock || 0} onChange={handleChange} />
        <Input name="category" placeholder="Category" value={form.category || ''} onChange={handleChange} />
        <Input name="slug" placeholder="Slug" value={form.slug || ''} onChange={handleChange} />
        <Textarea name="description" placeholder="Description" value={form.description || ''} onChange={handleChange} />
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          <Button variant="ghost" onClick={() => router.push('/admin/products')}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}

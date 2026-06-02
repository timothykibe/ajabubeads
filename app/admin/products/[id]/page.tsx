"use client";

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, X, Plus, Trash2 } from 'lucide-react';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<any>({
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    category: '',
    slug: '',
    description: '',
    optionLabelA: 'Type',
    optionLabelB: 'Option',
    optionValuesA: [] as string[],
    optionValuesB: [] as string[],
    images: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setError(null);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data = await res.json();
        setForm({
          ...data.data,
          optionLabelA: data.data.optionLabelA || 'Type',
          optionLabelB: data.data.optionLabelB || 'Option',
          optionValuesA: data.data.colors || [],
          optionValuesB: data.data.sizes || [],
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addOptionValue = (type: 'A' | 'B') => {
    const newValue = form[`newOption${type}`]?.trim();
    if (!newValue) return;
    const key = type === 'A' ? 'optionValuesA' : 'optionValuesB';
    setForm({
      ...form,
      [key]: [...(form[key] || []), newValue],
      [`newOption${type}`]: '',
    });
  };

  const removeOptionValue = (type: 'A' | 'B', index: number) => {
    const key = type === 'A' ? 'optionValuesA' : 'optionValuesB';
    const updated = [...(form[key] || [])];
    updated.splice(index, 1);
    setForm({ ...form, [key]: updated });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('Not authenticated');

      const body = {
        name: form.name,
        sku: form.sku,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        optionLabelA: form.optionLabelA,
        optionLabelB: form.optionLabelB,
        slug: form.slug,
        images: form.images || [],
        description: form.description,
        colors: form.optionValuesA || [],
        sizes: form.optionValuesB || [],
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save product');
      }

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground mt-1">Update product details and inventory</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name</label>
              <Input name="name" placeholder="e.g., Beaded Bracelet" value={form.name || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SKU</label>
              <Input name="sku" placeholder="Unique SKU" value={form.sku || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (KES)</label>
              <Input name="price" type="number" placeholder="0" value={form.price || 0} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock Quantity</label>
              <Input name="stock" type="number" placeholder="0" value={form.stock || 0} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input name="category" placeholder="e.g., Necklaces" value={form.category || ''} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slug</label>
              <Input name="slug" placeholder="url-friendly-name" value={form.slug || ''} onChange={handleChange} />
            </div>
          </div>

          {/* Options (Variants) */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Option A */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Option Label A</label>
              <Input
                name="optionLabelA"
                placeholder="e.g., Color"
                value={form.optionLabelA || 'Type'}
                onChange={handleChange}
              />
              <div className="flex gap-2">
                <Input
                  value={form.newOptionA || ''}
                  placeholder={`Add ${form.optionLabelA || 'value'}...`}
                  onChange={(e) => setForm({ ...form, newOptionA: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && addOptionValue('A')}
                />
                <Button type="button" size="sm" onClick={() => addOptionValue('A')} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.optionValuesA || []).map((value: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
                  >
                    {value}
                    <button
                      type="button"
                      onClick={() => removeOptionValue('A', idx)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Option B */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Option Label B</label>
              <Input
                name="optionLabelB"
                placeholder="e.g., Size"
                value={form.optionLabelB || 'Option'}
                onChange={handleChange}
              />
              <div className="flex gap-2">
                <Input
                  value={form.newOptionB || ''}
                  placeholder={`Add ${form.optionLabelB || 'value'}...`}
                  onChange={(e) => setForm({ ...form, newOptionB: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && addOptionValue('B')}
                />
                <Button type="button" size="sm" onClick={() => addOptionValue('B')} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.optionValuesB || []).map((value: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
                  >
                    {value}
                    <button
                      type="button"
                      onClick={() => removeOptionValue('B', idx)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="description"
              placeholder="Product description..."
              rows={6}
              value={form.description || ''}
              onChange={handleChange}
            />
          </div>

          {/* Images (simple text input for now – could be enhanced) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Image URLs (one per line)</label>
            <Textarea
              name="imagesText"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
              rows={3}
              value={Array.isArray(form.images) ? form.images.join('\n') : ''}
              onChange={(e) => setForm({ ...form, images: e.target.value.split('\n').filter(Boolean) })}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={() => router.push('/admin/products')}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
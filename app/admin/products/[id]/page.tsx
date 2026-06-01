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
  const [form, setForm] = useState<any>({
    optionLabelA: 'Type',
    optionLabelB: 'Option',
    optionValuesA: [] as string[],
    optionValuesB: [] as string[],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setForm({
            ...data.data,
            optionLabelA: data.data.optionLabelA || 'Type',
            optionLabelB: data.data.optionLabelB || 'Option',
            optionValuesA: data.data.colors || [],
            optionValuesB: data.data.sizes || [],
          });
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
        optionLabelA: form.optionLabelA,
        optionLabelB: form.optionLabelB,
        slug: form.slug,
        images: form.images || [],
        description: form.description,
        colors: form.optionValuesA || [],
        sizes: form.optionValuesB || [],
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Input
              name="optionLabelA"
              placeholder="Option name"
              value={form.optionLabelA || 'Type'}
              onChange={handleChange}
            />
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={form.newOptionA || ''}
                placeholder="Add option value"
                onChange={(e) => setForm({ ...form, newOptionA: e.target.value })}
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={() => {
                  if (!form.newOptionA?.trim()) return;
                  setForm({
                    ...form,
                    optionValuesA: [...(form.optionValuesA || []), form.newOptionA.trim()],
                    newOptionA: '',
                  });
                }}
                className="px-3 py-2 bg-primary text-white rounded"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(form.optionValuesA || []).map((value: string, idx: number) => (
                <span key={idx} className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                  {value}
                </span>
              ))}
            </div>
          </div>
          <div>
            <Input
              name="optionLabelB"
              placeholder="Second option name"
              value={form.optionLabelB || 'Option'}
              onChange={handleChange}
            />
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={form.newOptionB || ''}
                placeholder="Add option value"
                onChange={(e) => setForm({ ...form, newOptionB: e.target.value })}
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                type="button"
                onClick={() => {
                  if (!form.newOptionB?.trim()) return;
                  setForm({
                    ...form,
                    optionValuesB: [...(form.optionValuesB || []), form.newOptionB.trim()],
                    newOptionB: '',
                  });
                }}
                className="px-3 py-2 bg-primary text-white rounded"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(form.optionValuesB || []).map((value: string, idx: number) => (
                <span key={idx} className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                  {value}
                </span>
              ))}
            </div>
          </div>
        </div>
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

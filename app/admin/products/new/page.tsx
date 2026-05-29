'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [saving, setSaving] = useState(false);

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/uploads', { method: 'POST', body: fd });
    const data = await res.json();
    if (data?.url) return data.url;
    return null;
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await uploadFile(f);
    if (url) setImages((s) => [...s, url]);
  };

  const handleAddOption = (setter: any, value: string) => {
    if (!value) return;
    setter((arr: string[]) => [...arr, value]);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const body = {
        name,
        description,
        price: Number(price),
        sku,
        category,
        slug: (name || '').toLowerCase().replace(/\s+/g, '-'),
        colors,
        sizes,
        stock: Number(stock),
        images,
      };
      const res = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Create failed');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      alert('Failed to create product');
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add Product</h1>
        <p className="text-sm text-muted-foreground">Add product details, upload images and configure options.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium">SKU</label>
          <input value={sku} onChange={(e) => setSku(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Price</label>
          <input type="number" value={price as any} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Stock</label>
          <input type="number" value={stock as any} onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Images</label>
          <input type="file" accept="image/*" onChange={handleAddImage} />
          <div className="flex gap-2 mt-2">
            {images.map((src) => (
              <img key={src} src={src} className="w-20 h-20 object-cover rounded" />
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded p-3 min-h-[120px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Colors</label>
          <div className="flex gap-2 mt-2">
            <input value={newColor} onChange={(e) => setNewColor(e.target.value)} placeholder="Add color" className="border rounded px-3 py-2" />
            <button onClick={() => { handleAddOption(setColors, newColor); setNewColor(''); }} className="px-3 py-2 bg-primary text-white rounded">Add</button>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {colors.map((c, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 rounded">{c}</span>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Sizes</label>
          <div className="flex gap-2 mt-2">
            <input value={newSize} onChange={(e) => setNewSize(e.target.value)} placeholder="Add size" className="border rounded px-3 py-2" />
            <button onClick={() => { handleAddOption(setSizes, newSize); setNewSize(''); }} className="px-3 py-2 bg-primary text-white rounded">Add</button>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {sizes.map((s, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 rounded">{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={saving}>{saving ? 'Creating...' : 'Create Product'}</Button>
        <Button variant="outline" onClick={() => router.push('/admin/products')}>Cancel</Button>
      </div>
    </div>
  );
}


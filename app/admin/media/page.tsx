"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function AdminMediaPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { fetchMedia(); }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/media');
      const data = await res.json();
      setMedia(data.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load media');
    } finally { setLoading(false); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/media', { method: 'POST', body: fd, headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Upload failed');
      await fetchMedia();
      alert('Uploaded');
    } catch (err) {
      console.error(err);
      alert('Upload error');
    } finally { setUploading(false); }
  };

  if (loading) return <div className="p-8">Loading media...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">Upload and manage images</p>
        </div>
        <div>
          <input type="file" accept="image/*" onChange={handleUpload} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {media.map((m) => (
          <div key={m.id} className="border rounded p-2 text-center">
            <img src={m.url} alt={m.fileName} className="w-full h-40 object-cover mb-2" />
            <div className="text-sm truncate">{m.fileName}</div>
            <div className="text-xs text-muted-foreground">{(m.size || 0) / 1024 | 0} KB</div>
          </div>
        ))}
      </div>
    </div>
  );
}

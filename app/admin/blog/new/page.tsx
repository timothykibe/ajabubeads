'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';

export default function NewBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featured, setFeatured] = useState<string | null>(null);
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [mediaUploadStatus, setMediaUploadStatus] = useState('');

  const handleUploadFeatured = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const fd = new FormData();
    fd.append('file', f);
    const res = await fetch('/api/uploads', { method: 'POST', body: fd });
    const data = await res.json();
    if (data?.url) setFeatured(data.url);
  };

  const handleInsertMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setMediaUploadStatus('Uploading media...');
    try {
      const fd = new FormData();
      fd.append('file', f);
      const res = await fetch('/api/uploads', { method: 'POST', body: fd });
      const data = await res.json();
      if (data?.url) {
        setContent((prev) => `${prev}\n\n<img src="${data.url}" alt="Blog media" />\n\n`);
        setMediaUploadStatus('Media added to content');
      } else {
        setMediaUploadStatus('Upload failed.');
      }
    } catch (err) {
      console.error(err);
      setMediaUploadStatus('Upload failed.');
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const body = { title, slug, excerpt, content, featuredImage: featured, tags: tags.split(',').map(t => t.trim()).filter(Boolean) };
      const res = await fetch('/api/blogs', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Save failed');
      router.push('/admin/blog');
    } catch (err) {
      console.error(err);
      alert('Failed to save blog');
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Blog Post</h1>
        <p className="text-sm text-muted-foreground">Create a blog post with formatting, images or video embeds.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-medium">Excerpt</label>
          <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Content</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div>
          <label className="text-sm font-medium">Featured Image</label>
          <input type="file" accept="image/*" onChange={handleUploadFeatured} />
          {featured && <img src={featured} alt="featured" className="mt-2 w-48 h-32 object-cover rounded" />}
        </div>
        <div>
          <label className="text-sm font-medium">Insert media into content</label>
          <input type="file" accept="image/*" onChange={handleInsertMedia} />
          {mediaUploadStatus && <p className="mt-2 text-sm text-muted-foreground">{mediaUploadStatus}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div>
          <label className="text-sm font-medium">Tags (comma separated)</label>
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={saving}>{saving ? 'Saving...' : 'Publish'}</Button>
        <Button variant="outline" onClick={() => router.push('/admin/blog')}>Cancel</Button>
      </div>
    </div>
  );
}

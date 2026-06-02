'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RichTextEditor from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Plus, X, Upload } from 'lucide-react';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    tags: [] as string[],
    author: 'Ajabu Beads',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/blogs/${id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setForm({
        title: data.data.title || '',
        slug: data.data.slug || '',
        excerpt: data.data.excerpt || '',
        content: data.data.content || '',
        featuredImage: data.data.featuredImage || '',
        tags: data.data.tags || [],
        author: data.data.author || 'Ajabu Beads',
        metaTitle: data.data.metaTitle || '',
        metaDescription: data.data.metaDescription || '',
        metaKeywords: data.data.metaKeywords || '',
      });
    } catch (err) {
      console.error(err);
      alert('Failed to load blog');
      router.push('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (titleStr: string) => {
    return titleStr.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm(prev => ({
      ...prev,
      title: val,
      slug: generateSlug(val),
      metaTitle: val,
    }));
  };

  const addTag = () => {
    if (newTag && !form.tags.includes(newTag)) {
      setForm({ ...form, tags: [...form.tags, newTag] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
  };

  const handleFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFeatured(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/uploads', { method: 'POST', body: fd });
      const data = await res.json();
      if (data?.url) setForm({ ...form, featuredImage: data.url });
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploadingFeatured(false);
    }
  };

  const removeFeaturedImage = () => setForm({ ...form, featuredImage: '' });

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.content) {
      alert('Please fill title, slug, and content');
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Update failed');
      alert('Blog updated');
      router.push('/admin/blog');
    } catch (err) {
      console.error(err);
      alert('Failed to update blog');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <h2 className="text-lg font-semibold">Content</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={handleTitleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={2}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content *</label>
              <RichTextEditor value={form.content} onChange={(html) => setForm({ ...form, content: html })} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Featured Image */}
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <h2 className="text-lg font-semibold">Featured Image</h2>
            <div>
              <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {uploadingFeatured ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleFeaturedUpload} disabled={uploadingFeatured} />
              </label>
              {form.featuredImage && (
                <div className="mt-3 relative">
                  <img src={form.featuredImage} alt="Featured" className="w-full h-40 object-cover rounded-lg" />
                  <button onClick={removeFeaturedImage} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <h2 className="text-lg font-semibold">Tags</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="New tag"
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <Button onClick={addTag} size="sm"><Plus className="w-4 h-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map(tag => (
                <div key={tag} className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  {tag}
                  <button onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Author */}
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <h2 className="text-lg font-semibold">Author</h2>
            <input
              type="text"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* SEO */}
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <h2 className="text-lg font-semibold">SEO</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meta Title</label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meta Description</label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                rows={2}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Meta Keywords</label>
              <input
                type="text"
                value={form.metaKeywords}
                onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="comma, separated"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
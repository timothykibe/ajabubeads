'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { X, Upload, Loader2 } from 'lucide-react';

export default function NewBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);

  const generateSlug = (titleStr: string) => {
    return titleStr.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(val));
    }
  };

  const handleFeaturedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFeatured(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/uploads', { method: 'POST', body: formData });
      const data = await res.json();
      if (data?.url) setFeaturedImage(data.url);
      else alert('Upload failed');
    } catch (err) {
      console.error(err);
      alert('Upload error');
    } finally {
      setUploadingFeatured(false);
    }
  };

  const removeFeaturedImage = () => setFeaturedImage(null);

  const handleSubmit = async () => {
    if (!title || !slug || !content) {
      alert('Please fill in title, slug, and content');
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const body = {
        title,
        slug,
        excerpt,
        content,
        featuredImage,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        author: 'Ajabu Beads',
      };
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Save failed');
      router.push('/admin/blog');
    } catch (err) {
      console.error(err);
      alert('Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Blog Post</h1>
        <p className="text-sm text-muted-foreground">Create a new blog post with rich formatting and images.</p>
      </div>

      <div className="space-y-4">
        {/* Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Blog title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="blog-post-url"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium mb-1">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Short summary (optional)"
          />
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium mb-1">Content *</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        {/* Featured Image Upload */}
        <div className="border rounded-lg p-4 space-y-3">
          <label className="block text-sm font-medium">Featured Image</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-primary/90">
              <Upload className="w-4 h-4" />
              {uploadingFeatured ? 'Uploading...' : 'Upload Image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleFeaturedUpload} disabled={uploadingFeatured} />
            </label>
            {featuredImage && (
              <button onClick={removeFeaturedImage} className="text-red-500 text-sm flex items-center gap-1">
                <X className="w-4 h-4" /> Remove
              </button>
            )}
          </div>
          {uploadingFeatured && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</div>}
          {featuredImage && (
            <img src={featuredImage} alt="Featured" className="mt-2 w-48 h-32 object-cover rounded-lg border" />
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="jewelry, handmade, beads"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Publish
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin/blog')}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
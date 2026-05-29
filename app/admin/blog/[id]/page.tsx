'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

export default function BlogEditorPage() {
  const router = useRouter();
  const params = useParams();
  const isEdit = params.id && params.id !== 'new';

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Ajabu Beads',
    tags: [],
    featuredImage: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });

  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchBlog();
    }
  }, []);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch blog');

      const data = await response.json();
      setFormData(data.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      alert('Failed to load blog');
      router.push('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
      metaTitle: title,
    });
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.content) {
      alert('Please fill in title, slug, and content');
      return;
    }

    try {
      setSaving(true);

      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `/api/blogs/${params.id}` : '/api/blogs';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save blog');

      alert(isEdit ? 'Blog updated successfully' : 'Blog created successfully');
      router.push('/admin/blog');
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            {isEdit ? 'Edit Blog Post' : 'New Blog Post'}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {isEdit ? 'Update' : 'Create'} Blog
        </Button>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold">Content</h2>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Blog title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Short summary of your blog post"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog content here. Use # for headings, ** for bold, _ for italic"
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Formatting: # Heading, ## Subheading, **bold**, _italic_
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* SEO */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold">SEO</h2>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="blog-post-slug"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="Meta title for SEO"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Meta Description
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="Meta description for search engines"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Meta Keywords
              </label>
              <input
                type="text"
                value={formData.metaKeywords}
                onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                placeholder="Comma-separated keywords"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold">Featured Image</h2>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Image URL
              </label>
              <input
                type="text"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            {formData.featuredImage && (
              <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.jpg';
                  }}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold">Tags</h2>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tag"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <Button onClick={handleAddTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Author */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold">Author</h2>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Author Name
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Author name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

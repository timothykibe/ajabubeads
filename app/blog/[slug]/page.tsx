'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Eye, Loader2, AlertCircle } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  tags: string[];
  views: number;
  createdAt: string;
  metaDescription: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blogs/${slug}`);

        if (!response.ok) {
          throw new Error('Blog not found');
        }

        const data = await response.json();
        setBlog(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header cartCount={0} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header cartCount={0} />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center space-y-4 max-w-md">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">Blog Not Found</h1>
            <p className="text-muted-foreground">{error}</p>
            <Link href="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header cartCount={0} />

      {/* Hero with Featured Image */}
      {blog.featuredImage && (
        <div className="relative w-full h-96 bg-muted overflow-hidden">
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Content */}
      <article className="flex-1 py-12 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold">{blog.title}</h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{blog.author}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time>{new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</time>
              </div>

              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{blog.views.toLocaleString()} views</span>
              </div>
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {blog.tags.map((tag) => (
                  <Link key={tag} href={`/blog?tag=${tag}`}>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors inline-block">
                      {tag}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-6 text-foreground">
            {blog.content.split('\n').map((paragraph, idx) => {
              if (!paragraph.trim()) return null;

              // Check if it's a heading (starts with # or ##)
              if (paragraph.startsWith('###')) {
                return (
                  <h3 key={idx} className="text-2xl font-serif font-bold mt-8 mb-4">
                    {paragraph.replace(/^#+\s/, '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('##')) {
                return (
                  <h2 key={idx} className="text-3xl font-serif font-bold mt-8 mb-4">
                    {paragraph.replace(/^#+\s/, '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('#')) {
                return (
                  <h1 key={idx} className="text-4xl font-serif font-bold mt-8 mb-4">
                    {paragraph.replace(/^#+\s/, '')}
                  </h1>
                );
              }

              // Check if it's bold/italic
              const processedText = paragraph
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/_(.*?)_/g, '<em>$1</em>');

              return (
                <p key={idx} className="text-lg leading-relaxed text-foreground/90">
                  {processedText}
                </p>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Author Card */}
          <div className="bg-secondary/30 border border-border rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-lg">{blog.author}</p>
                <p className="text-muted-foreground">
                  Ajabu Beads - Handcrafted ethical jewelry from Kenya
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center pt-8">
            <Link href="/blog">
              <Button variant="outline">More Stories</Button>
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}

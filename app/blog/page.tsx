'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  tags: string[];
  views: number;
  createdAt: string;
}

export default function BlogPage() {
  const [blogs, setBlog] = useState<Blog[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        let url = '/api/blogs?skip=0&take=12';

        if (selectedTag) {
          url = `/api/blogs/tag/${selectedTag}?skip=0&take=12`;
        } else if (searchQuery) {
          url = `/api/blogs/search?q=${encodeURIComponent(searchQuery)}&skip=0&take=12`;
        }

        const response = await fetch(url);
        const data = await response.json();

        setBlog(data.data.blogs || data.data || []);
        setHasMore((data.data.blogs?.length || data.data?.length || 0) === 12);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [selectedTag, searchQuery]);

  // Fetch tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/blogs/tags');
        const data = await response.json();
        setTags(data.data || []);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(0);
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header cartCount={0} />

      {/* Hero */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 md:py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Ajabu Stories</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the artistry, craftsmanship, and stories behind every piece
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border py-4 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-primary/20'
                }`}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-primary/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="flex-1 py-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No blogs found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link href={`/blog/${blog.slug}`} key={blog.id}>
                  <article className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all h-full">
                    {/* Featured Image */}
                    {blog.featuredImage && (
                      <div className="relative w-full h-48 bg-muted overflow-hidden">
                        <Image
                          src={blog.featuredImage}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Tags */}
                      {blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {blog.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h2 className="text-xl font-serif font-bold group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {blog.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                        <span>{blog.author}</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  rating: number;
  reviewCount: number;
  category: string;
  inStock: boolean;
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products?take=100');
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error || 'Failed to fetch products');
        }
        const data = await response.json();
        const productsArray = Array.isArray(data?.data?.products)
          ? data.data.products
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
        setProducts(productsArray);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('ajabuCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    setIsAuthenticated(!!accessToken);
    if (accessToken) {
      fetch('/api/user/saved-products', { headers: { Authorization: `Bearer ${accessToken}` } })
        .then(async (res) => {
          if (!res.ok) return [];
          const data = await res.json();
          return Array.isArray(data?.data?.items) ? data.data.items : [];
        })
        .then((saved: any[]) => setSavedProductIds(saved.map((item) => item.id)))
        .catch(() => setSavedProductIds([]));
    }
  }, []);

  const handleAddToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === productId);
      let updated;
      if (existingItem) {
        updated = prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prev, { ...product, quantity: 1 }];
      }
      localStorage.setItem('ajabuCart', JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleSavedProduct = async (productId: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      window.location.href = `/login?redirect=/shop`;
      return;
    }

    const isCurrentlySaved = savedProductIds.includes(productId);
    const method = isCurrentlySaved ? 'DELETE' : 'POST';
    const response = await fetch('/api/user/saved-products', {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    if (response.ok) {
      setSavedProductIds((prev) => {
        if (isCurrentlySaved) {
          return prev.filter((id) => id !== productId);
        }
        return [...prev, productId];
      });
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Filter products
  const productList = Array.isArray(products) ? products : [];
  let filteredProducts = productList.filter((product) => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory) {
      return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    return true;
  });

  // Sort products
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const categories = ['All', ...Array.from(new Set(products.map((product) => product.category)))];

  return (
    <main className="min-h-screen bg-background">
      <Header cartCount={cartCount} />

      {/* Page Header */}
      <div className="bg-secondary/20 py-8 md:py-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">
            Shop Our Collection
          </h1>
          <p className="text-muted-foreground">
            Explore our handcrafted bracelets and beads celebrating African and Indian artistry
          </p>
        </div>
      </div>

      {/* Shop Layout */}
      <div className="py-8 md:py-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Mobile */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 mb-4 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors w-full"
              >
                <Filter className="w-4 h-4" />
                {isFilterOpen ? 'Hide' : 'Show'} Filters
              </button>

              {isFilterOpen && (
                <div className="bg-card p-4 rounded-lg border border-border space-y-6 mb-6">
                  {/* Category Filter */}
                  <div>
                    <h3 className="font-semibold mb-4">Category</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategory === category}
                            onChange={() => setSelectedCategory(category)}
                            className="w-4 h-4 rounded border-border"
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold mb-4">Price Range</h3>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                      <div className="text-sm text-muted-foreground">
                        KES 0 - KES {priceRange[1].toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-20 space-y-6">
                {/* Category Filter */}
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-4">Category</h3>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h3 className="font-semibold mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground">
                      KES {priceRange[0].toLocaleString()} - KES {priceRange[1].toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Sort Bar */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} products
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">Loading products...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-red-50 p-6 rounded-lg border border-red-200">
                  <p className="text-red-600">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.images?.[0] || '/products/bracelet-1.jpg'}
                      rating={product.rating || 5}
                      reviews={product.reviewCount || 0}
                      onAddToCart={handleAddToCart}
                      onSave={handleToggleSavedProduct}
                      isSaved={savedProductIds.includes(product.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No products found matching your filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

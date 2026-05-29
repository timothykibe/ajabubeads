'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  Loader2,
  AlertCircle,
  Check,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  colors: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  category: string;
  inStock: boolean;
}

interface CartItem extends Product {
  image?: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) throw new Error('Product not found');

        const data = await response.json();
        setProduct(data.data);

        // Set default selections
        if (data.data.colors?.length > 0) {
          setSelectedColor(data.data.colors[0]);
        }
        if (data.data.sizes?.length > 0) {
          setSelectedSize(data.data.sizes[0]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Load cart, auth state, and saved products from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('ajabuCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsAuthenticated(
      typeof window !== 'undefined' && !!localStorage.getItem('accessToken')
    );

    const savedProducts = localStorage.getItem('ajabuSavedProducts');
    if (savedProducts && product) {
      try {
        const savedArray = JSON.parse(savedProducts) as Array<{ id: string }>;
        setIsSaved(savedArray.some((item) => item.id === product.id));
      } catch {
        setIsSaved(false);
      }
    }
  }, [product]);

  // Listen for auth changes so UI updates when user logs in/out
  useEffect(() => {
    const updateAuth = () => {
      setIsAuthenticated(typeof window !== 'undefined' && !!localStorage.getItem('accessToken'));
    };
    updateAuth();
    window.addEventListener('storage', updateAuth);
    window.addEventListener('auth-changed', updateAuth);
    return () => {
      window.removeEventListener('storage', updateAuth);
      window.removeEventListener('auth-changed', updateAuth);
    };
  }, []);

  const handleToggleSaved = async () => {
    if (!product) return;
    const savedKey = 'ajabuSavedProducts';

    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please sign in to save products to your account.',
        action: (
          <ToastAction altText="Sign in" onClick={() => router.push(`/login?redirect=/product/${productId}`)}>
            Sign in
          </ToastAction>
        ),
      });
      return;
    }

    const savedProductsJson = localStorage.getItem(savedKey);
    let savedProducts: SavedProduct[] = [];

    if (savedProductsJson) {
      try {
        savedProducts = JSON.parse(savedProductsJson) as SavedProduct[];
      } catch {
        savedProducts = [];
      }
    }

    const existingIndex = savedProducts.findIndex((item) => item.id === product.id);
    try {
      if (existingIndex >= 0) {
        await fetch('/api/user/saved-products', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        });
        savedProducts.splice(existingIndex, 1);
        setIsSaved(false);
        setSuccessMessage('Removed from saved products');
      } else {
        await fetch('/api/user/saved-products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id }),
        });
        savedProducts.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '/products/bracelet-1.jpg',
        });
        setIsSaved(true);
        setSuccessMessage('Saved to your account');
      }

      localStorage.setItem(savedKey, JSON.stringify(savedProducts));
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating saved products:', err);
      setError('Failed to update saved products');
    }
  };

  interface SavedProduct {
    id: string;
    name: string;
    price: number;
    image?: string;
  }

  const handleAddToCart = async () => {
    if (!product) return;

    // Guests may add to cart; do not require authentication

    // Validate selections
    if (product.colors?.length > 0 && !selectedColor) {
      setError('Please select a color');
      return;
    }
    if (product.sizes?.length > 0 && !selectedSize) {
      setError('Please select a size');
      return;
    }

    try {
      setAddingToCart(true);
      setError('');

      // Check stock via API
      const response = await fetch(`/api/products/${productId}`);
      const updated = await response.json();

      if (updated.data.stock < quantity) {
        setError(`Only ${updated.data.stock} items available`);
        return;
      }

      // Add to cart
      const updatedCart = [...cart];
      const existingItem = updatedCart.find(
        (item) =>
          item.id === productId &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        updatedCart.push({
          ...product,
          image: product.images?.[0] || '/products/bracelet-1.jpg',
          quantity,
          selectedColor,
          selectedSize,
        });
      }

      setCart(updatedCart);
      localStorage.setItem('ajabuCart', JSON.stringify(updatedCart));

      setSuccessMessage(
        `Added ${quantity} item${quantity > 1 ? 's' : ''} to cart!`
      );
      setTimeout(() => setSuccessMessage(''), 3000);
      setQuantity(1);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity > 0 && product && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };
  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header cartCount={cartCount} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!product || error === 'Failed to load product') {
    return (
      <main className="min-h-screen bg-background">
        <Header cartCount={cartCount} />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-lg text-muted-foreground">
            {error || 'Product not found'}
          </p>
          <Link href="/shop">
            <Button className="mt-4">Back to Shop</Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header cartCount={cartCount} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/shop" className="text-primary hover:underline mb-6 block">
          ← Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={product.images?.[0] || '/placeholder.jpg'}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images?.slice(0, 4).map((image, idx) => (
                <div
                  key={idx}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:border-2 hover:border-primary"
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${idx + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {product.category}
              </p>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.reviewCount} reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-primary">
              KES {product.price.toLocaleString()}
            </div>

            {/* Stock Status */}
            <div
              className={`p-3 rounded-lg ${
                product.stock > 0
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {product.stock > 0 ? (
                <p className="text-sm">✓ {product.stock} in stock</p>
              ) : (
                <p className="text-sm">Out of stock</p>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedColor === color
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-semibold mb-3">
                  Size
                </label>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  −
                </button>
                <span className="text-lg font-semibold w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="flex gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="flex gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
                <Check className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{successMessage}</p>
              </div>
            )}

            {/* Guests may add to cart; saving requires login */}

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className="w-full py-3 text-lg"
            >
              {addingToCart ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add to Cart'
              )}
            </Button>

            {/* Wishlist & Share */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsFavorite(!isFavorite);
                  handleToggleSaved();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isSaved ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-sm">Free shipping over KES 5,000</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-sm">100% Secure Payment</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-primary" />
                <span className="text-sm">14-day Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 pt-12 border-t">
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          {/* Will add related products section */}
        </div>
      </div>

      <Footer />
    </main>
  );
}

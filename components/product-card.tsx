'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  onAddToCart?: (productId: string) => void;
  showAddToCart?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  rating,
  reviews,
  onAddToCart,
  showAddToCart = false,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (!onAddToCart) return;
    onAddToCart(id);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-muted h-64 md:h-72">
        <Link href={`/product/${id}`}>
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </Link>
        
        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/90 hover:bg-background shadow-md transition-colors"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <Link href={`/product/${id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex text-yellow-500">
            {'★'.repeat(Math.floor(rating))}
            {'☆'.repeat(5 - Math.floor(rating))}
          </div>
          <span className="text-muted-foreground">({reviews})</span>
        </div>

        {/* Price */}
        <div className="font-bold text-lg text-primary">
          KES {price.toLocaleString()}
        </div>

        {/* View Product Button */}
        {showAddToCart && (
          <Link
            href={`/product/${id}`}
            className="inline-flex items-center justify-center w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Link>
        )}
      </div>
    </div>
  );
}

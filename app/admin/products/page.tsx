'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Pencil,
  Trash2,
  Plus,
  AlertCircle,
  Package,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  costPrice?: number;
  stock: number;
  category: string;
  inStock: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lowStockWarning, setLowStockWarning] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('adminToken');

        // Fetch all products
        const response = await fetch('/api/admin/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Fetch low stock
        const lowStockResponse = await fetch('/api/admin/products?lowStock=true', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setProducts(result.data.products || []);
        }

        if (lowStockResponse.ok) {
          const lowStockResult = await lowStockResponse.json();
          setLowStockWarning(lowStockResult.data || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productId));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus size={18} />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Low Stock Warning */}
      {lowStockWarning.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>{lowStockWarning.length} product(s) have low stock.</strong> Consider restocking.
          </AlertDescription>
        </Alert>
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-gray-600 text-sm">{product.sku}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                        {product.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      KES {product.price.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">{product.stock}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`px-2 py-1 text-sm rounded ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-700'
                            : product.stock > 0
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}`}>
                          <Button variant="ghost" size="sm">
                            <Pencil size={16} />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this product? This action cannot be undone.
                            </AlertDialogDescription>
                            <div className="flex justify-end gap-2">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!product.isActive || product.quantity <= 0) {
      toast.error('Product is not available');
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(addToCart({
        productId: product.id,
        quantity: 1,
      })).unwrap();
      toast.success('Product added to cart');
    } catch (error: any) {
      // Check if authentication is required
      if (error.isAuthRequired) {
        toast.error('Please login to add items to cart');
        router.push('/auth/login');
      } else {
        toast.error(error.message || 'Failed to add product to cart');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const discount = product.comparePrice ? calculateDiscount(product.price, product.comparePrice) : 0;

  if (viewMode === 'list') {
    return (
      <Card className="group hover:shadow-lg transition-shadow duration-300">
        <div className="flex">
          {/* Image Section */}
          <div className="relative w-48 h-48 flex-shrink-0">
            <Link href={`/products/${product.slug}`}>
              <div className="w-full h-full relative">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-l-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-l-lg">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                
                {discount > 0 && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                    -{discount}%
                  </Badge>
                )}
                
                {!product.isActive && (
                  <Badge variant="destructive" className="absolute top-2 right-2">
                    Out of Stock
                  </Badge>
                )}
              </div>
            </Link>
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 rounded-l-lg">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                onClick={handleAddToCart}
                disabled={isLoading || !product.isActive || product.quantity <= 0}
              >
                <ShoppingCart className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                asChild
              >
                <Link href={`/products/${product.slug}`}>
                  <Eye className="h-3 w-3" />
                </Link>
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
              >
                <Heart className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col p-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-xs">
                  {product.category?.name || 'Uncategorized'}
                </Badge>
                {product._count?.reviews && product._count.reviews > 0 && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{product._count.reviews}</span>
                  </div>
                )}
              </div>
              
              <Link href={`/products/${product.slug}`}>
                <h3 className="font-semibold text-xl mb-2 hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              {product.description && (
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {product.description}
                </p>
              )}
              
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>
              
              {product.trackQuantity && (
                <p className="text-sm text-muted-foreground">
                  {product.quantity > 0 ? (
                    `${product.quantity} in stock`
                  ) : (
                    'Out of stock'
                  )}
                </p>
              )}
            </div>

            {/* Action Section */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={isLoading || !product.isActive || product.quantity <= 0}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Adding...
                    </div>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <div className="relative overflow-hidden rounded-t-lg">
        <Link href={`/products/${product.slug}`}>
          <div className="aspect-square relative">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
            
            {discount > 0 && (
              <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                -{discount}%
              </Badge>
            )}
            
            {!product.isActive && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                Out of Stock
              </Badge>
            )}
          </div>
        </Link>
        
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10"
            onClick={handleAddToCart}
            disabled={isLoading || !product.isActive || product.quantity <= 0}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10"
            asChild
          >
            <Link href={`/products/${product.slug}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {product.category?.name || 'Uncategorized'}
            </Badge>
            {product._count?.reviews && product._count.reviews > 0 && (
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="text-yellow-500">★</span>
                <span className="ml-1">{product._count.reviews}</span>
              </div>
            )}
          </div>
          
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
          
          {product.trackQuantity && (
            <p className="text-sm text-muted-foreground">
              {product.quantity > 0 ? (
                `${product.quantity} in stock`
              ) : (
                'Out of stock'
              )}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 mt-auto">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={isLoading || !product.isActive || product.quantity <= 0}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Adding...
            </div>
          ) : (
            'Add to Cart'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

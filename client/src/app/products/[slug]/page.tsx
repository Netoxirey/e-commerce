'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProductBySlug, fetchRelatedProducts, clearCurrentProduct } from '@/store/slices/productsSlice';
import { addToCart } from '@/store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProductCard } from '@/components/products/ProductCard';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const dispatch = useAppDispatch();
  const { currentProduct, relatedProducts, isLoading } = useAppSelector((state) => state.products);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    if (currentProduct) {
      dispatch(fetchRelatedProducts({ id: currentProduct.id, limit: 4 }));
    }
  }, [dispatch, currentProduct]);

  const handleAddToCart = async () => {
    if (!currentProduct || !currentProduct.isActive || currentProduct.quantity <= 0) {
      toast.error('Product is not available');
      return;
    }

    setIsAddingToCart(true);
    try {
      await dispatch(addToCart({
        productId: currentProduct.id,
        quantity,
      })).unwrap();
      toast.success('Product added to cart');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add product to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const discount = currentProduct.comparePrice ? calculateDiscount(currentProduct.price, currentProduct.comparePrice) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            {currentProduct.images && currentProduct.images.length > 0 ? (
              <Image
                src={currentProduct.images[selectedImage]}
                alt={currentProduct.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-4xl">📦</span>
              </div>
            )}
          </div>
          
          {currentProduct.images && currentProduct.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {currentProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative overflow-hidden rounded-md border-2 ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${currentProduct.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{currentProduct.category?.name || 'Uncategorized'}</Badge>
              {!currentProduct.isActive && (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-4">{currentProduct.name}</h1>
            
            {currentProduct.description && (
              <p className="text-muted-foreground text-lg mb-6">{currentProduct.description}</p>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(currentProduct.price)}
                </span>
                {currentProduct.comparePrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(currentProduct.comparePrice)}
                  </span>
                )}
                {discount > 0 && (
                  <Badge className="bg-red-500 text-white">
                    -{discount}%
                  </Badge>
                )}
              </div>
            </div>

            {currentProduct.trackQuantity && (
              <p className="text-sm text-muted-foreground mb-6">
                {currentProduct.quantity > 0 ? (
                  `${currentProduct.quantity} in stock`
                ) : (
                  'Out of stock'
                )}
              </p>
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantity:
              </label>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentProduct.quantity || 1, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                  disabled={quantity >= (currentProduct.quantity || 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !currentProduct.isActive || currentProduct.quantity <= 0}
                className="flex-1"
                size="lg"
              >
                {isAddingToCart ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Adding...
                  </div>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span className="text-sm">30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Product Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU:</span>
                    <span>{currentProduct.sku || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight:</span>
                    <span>{currentProduct.weight ? `${currentProduct.weight} lbs` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{currentProduct.isDigital ? 'Digital' : 'Physical'}</span>
                  </div>
                </div>
              </div>
              
              {currentProduct.attributes && currentProduct.attributes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Attributes</h4>
                  <div className="space-y-2 text-sm">
                    {currentProduct.attributes.map((attr, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-muted-foreground">{attr.name}:</span>
                        <span>{attr.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

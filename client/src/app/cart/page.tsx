'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCart, fetchCartSummary, updateCartItem, removeFromCart, clearCart } from '@/store/slices/cartSlice';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { CartSummary } from '@/components/cart/CartSummary';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { cart, summary, isLoading } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view your cart');
      router.push('/auth/login');
      return;
    }
    
    dispatch(fetchCart());
    dispatch(fetchCartSummary());
  }, [dispatch, isAuthenticated, router]);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await handleRemoveItem(itemId);
      return;
    }

    try {
      await dispatch(updateCartItem({ itemId, data: { quantity } })).unwrap();
      dispatch(fetchCartSummary());
      toast.success('Cart updated');
    } catch (error: any) {
      if (error.isAuthRequired) {
        toast.error('Please login to update cart');
        router.push('/auth/login');
      } else {
        toast.error(error.message || 'Failed to update cart');
      }
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
      dispatch(fetchCartSummary());
      toast.success('Item removed from cart');
    } catch (error: any) {
      if (error.isAuthRequired) {
        toast.error('Please login to manage cart');
        router.push('/auth/login');
      } else {
        toast.error(error.message || 'Failed to remove item');
      }
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await dispatch(clearCart()).unwrap();
        toast.success('Cart cleared');
      } catch (error: any) {
        if (error.isAuthRequired) {
          toast.error('Please login to manage cart');
          router.push('/auth/login');
        } else {
          toast.error(error.message || 'Failed to clear cart');
        }
      }
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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button asChild size="lg">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button
          variant="outline"
          onClick={handleClearCart}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <CartSummary summary={summary} />
        </div>
      </div>
    </div>
  );
}

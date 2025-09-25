'use client';

import { CartSummary as CartSummaryType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, CreditCard } from 'lucide-react';
import Link from 'next/link';

interface CartSummaryProps {
  summary: CartSummaryType | null;
}

export function CartSummary({ summary }: CartSummaryProps) {
  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Items ({summary.itemCount})</span>
            <span>{formatPrice(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>Calculated at checkout</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(summary.subtotal)}</span>
        </div>

        <div className="space-y-2">
          <Button asChild className="w-full" size="lg">
            <Link href="/checkout">
              <CreditCard className="mr-2 h-5 w-5" />
              Proceed to Checkout
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1">
            <span>✓</span>
            <span>Free shipping on orders over $50</span>
          </div>
          <div className="flex items-center gap-1">
            <span>✓</span>
            <span>30-day return policy</span>
          </div>
          <div className="flex items-center gap-1">
            <span>✓</span>
            <span>Secure payment</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

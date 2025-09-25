'use client';

import { CartSummary as CartSummaryType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, CreditCard, Shield, Truck } from 'lucide-react';

interface OrderSummaryProps {
  summary: CartSummaryType;
}

export function OrderSummary({ summary }: OrderSummaryProps) {
  const shipping = 0; // Free shipping
  const tax = summary.subtotal * 0.08; // 8% tax
  const total = summary.subtotal + shipping + tax;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({summary.itemCount} items)</span>
            <span>{formatPrice(summary.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span className="text-green-600">
              {shipping === 0 ? 'Free' : formatPrice(shipping)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        {/* Payment Info */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CreditCard className="h-4 w-4" />
            <span>Payment Method</span>
          </div>
          <p className="text-sm text-muted-foreground">
            You'll be redirected to a secure payment page to complete your purchase.
          </p>
        </div>

        {/* Security Features */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>256-bit SSL encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Free shipping on orders over $50</span>
          </div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>30-day return policy</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

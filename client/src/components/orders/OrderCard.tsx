'use client';

import { Order } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, formatDate, getOrderStatusColor, getPaymentStatusColor } from '@/lib/utils';
import { Package, Calendar, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
            <p className="text-sm text-muted-foreground">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{formatPrice(order.total)}</div>
            <div className="text-sm text-muted-foreground">
              {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Badges */}
        <div className="flex items-center gap-2">
          <Badge className={getOrderStatusColor(order.status)}>
            {order.status}
          </Badge>
          <Badge variant="outline" className={getPaymentStatusColor(order.paymentStatus)}>
            {order.paymentStatus}
          </Badge>
        </div>

        {/* Order Items Preview */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Items:</h4>
          <div className="space-y-1">
            {(order.items || []).slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="truncate">
                  {item.quantity} × {item.product.name}
                </span>
                <span className="text-muted-foreground">
                  {formatPrice(item.price)}
                </span>
              </div>
            ))}
            {(order.items?.length || 0) > 3 && (
              <p className="text-sm text-muted-foreground">
                +{(order.items?.length || 0) - 3} more item{(order.items?.length || 0) - 3 !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Items:</span>
            <span>{order.items?.length || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Date:</span>
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Shipping:</span>
            <span>{order.shippingAddress.city}, {order.shippingAddress.state}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/orders/${order.id}`}>
              View Details
            </Link>
          </Button>
          {order.status === 'PENDING' && (
            <Button variant="outline" size="sm" className="flex-1">
              Cancel Order
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

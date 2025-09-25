'use client';

import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatPrice, formatDateTime, getOrderStatusColor, getPaymentStatusColor } from '@/lib/utils';
import { Package, Calendar, MapPin, CreditCard, User, Phone, Mail } from 'lucide-react';
import Image from 'next/image';

interface OrderDetailProps {
  order: Order;
}

export function OrderDetail({ order }: OrderDetailProps) {
  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Order #{order.orderNumber}</CardTitle>
              <p className="text-muted-foreground">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatPrice(order.total)}</div>
              <div className="flex gap-2 mt-2">
                <Badge className={getOrderStatusColor(order.status)}>
                  {order.status}
                </Badge>
                <Badge variant="outline" className={getPaymentStatusColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items ({order.items?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    {item.product?.images && item.product.images.length > 0 ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name || 'Product'}
                        fill
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium line-clamp-2">
                      {item.product?.name || 'Product'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Price: {formatPrice(item.price)} each
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{formatPrice(order.shippingAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{formatPrice(order.taxAmount)}</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>

            {order.notes && (
              <div className="mt-4 p-3 bg-muted/50 rounded-md">
                <h4 className="font-medium text-sm mb-1">Order Notes</h4>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="font-medium">
              {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
            </p>
            <p>{order.shippingAddress?.address1}</p>
            {order.shippingAddress?.address2 && <p>{order.shippingAddress.address2}</p>}
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
            </p>
            <p>{order.shippingAddress?.country}</p>
            {order.shippingAddress?.phone && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Phone className="h-3 w-3" />
                {order.shippingAddress.phone}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="font-medium">
              {order.billingAddress?.firstName} {order.billingAddress?.lastName}
            </p>
            <p>{order.billingAddress?.address1}</p>
            {order.billingAddress?.address2 && <p>{order.billingAddress.address2}</p>}
            <p>
              {order.billingAddress?.city}, {order.billingAddress?.state} {order.billingAddress?.postalCode}
            </p>
            <p>{order.billingAddress?.country}</p>
            {order.billingAddress?.phone && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Phone className="h-3 w-3" />
                {order.billingAddress.phone}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      {order.user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="font-medium">
                {order.user?.firstName} {order.user?.lastName}
              </p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                {order.user?.email}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline">
          Download Invoice
        </Button>
        {order.status === 'PENDING' && (
          <Button variant="destructive">
            Cancel Order
          </Button>
        )}
        <Button>
          Track Package
        </Button>
      </div>
    </div>
  );
}

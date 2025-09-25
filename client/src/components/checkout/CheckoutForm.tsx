'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserProfile } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AddressCard } from '@/components/address/AddressCard';
import { CreateAddressDialog } from '@/components/address/CreateAddressDialog';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Plus, MapPin } from 'lucide-react';

interface CheckoutFormProps {
  register: any;
  errors: any;
  watchedFields: any;
  setValue: any;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  validationErrors: any[];
}

export function CheckoutForm({
  register,
  errors,
  watchedFields,
  setValue,
  onSubmit,
  isSubmitting,
  validationErrors,
}: CheckoutFormProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [showCreateAddress, setShowCreateAddress] = useState(false);

  const addresses = user?.addresses || [];

  useEffect(() => {
    if (user && !user.addresses) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  // Auto-select first address if none selected
  useEffect(() => {
    if (addresses.length > 0) {
      if (!watchedFields.shippingAddressId) {
        setValue('shippingAddressId', addresses[0].id);
      }
      if (!watchedFields.billingAddressId) {
        setValue('billingAddressId', addresses[0].id);
      }
    }
  }, [addresses, watchedFields.shippingAddressId, watchedFields.billingAddressId, setValue]);
  const canProceed = addresses.length > 0 && !validationErrors.length;

  // Debug logging
  console.log('CheckoutForm Debug:', {
    addresses: addresses.length,
    shippingAddressId: watchedFields.shippingAddressId,
    billingAddressId: watchedFields.billingAddressId,
    errors,
    canProceed
  });

  return (
    <div className="space-y-6">
      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Hidden input for form registration */}
          <input
            type="hidden"
            {...register('shippingAddressId')}
          />
          
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You need to add a shipping address to continue.
              </p>
              <Button onClick={() => setShowCreateAddress(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Address
              </Button>
            </div>
          ) : (
            <RadioGroup
              value={watchedFields.shippingAddressId}
              onValueChange={(value) => {
                setValue('shippingAddressId', value);
              }}
            >
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div key={address.id} className="flex items-start space-x-3">
                    <RadioGroupItem
                      value={address.id}
                      id={`shipping-${address.id}`}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={`shipping-${address.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <AddressCard address={address} />
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
          
          {errors.shippingAddressId && (
            <p className="text-sm text-red-500 mt-2">
              {errors.shippingAddressId.message}
            </p>
          )}
          
          {!watchedFields.shippingAddressId && addresses.length > 0 && (
            <p className="text-sm text-red-500 mt-2">
              Required
            </p>
          )}

          {addresses.length > 0 && (
            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={() => setShowCreateAddress(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Hidden input for form registration */}
          <input
            type="hidden"
            {...register('billingAddressId')}
          />
          
          <RadioGroup
            value={watchedFields.billingAddressId}
            onValueChange={(value) => {
              setValue('billingAddressId', value);
            }}
          >
            <div className="space-y-3">
              {addresses.map((address) => (
                <div key={address.id} className="flex items-start space-x-3">
                  <RadioGroupItem
                    value={address.id}
                    id={`billing-${address.id}`}
                    className="mt-1"
                  />
                  <Label
                    htmlFor={`billing-${address.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <AddressCard address={address} />
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          
          {errors.billingAddressId && (
            <p className="text-sm text-red-500 mt-2">
              {errors.billingAddressId.message}
            </p>
          )}
          
          {!watchedFields.billingAddressId && addresses.length > 0 && (
            <p className="text-sm text-red-500 mt-2">
              Required
            </p>
          )}
        </CardContent>
      </Card>

      {/* Order Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Order Notes (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Any special instructions for your order..."
            {...register('notes')}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          className="flex-1"
        >
          Back to Cart
        </Button>
        <Button
          type="submit"
          onClick={onSubmit}
          disabled={!canProceed || isSubmitting}
          className="flex-1"
          size="lg"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              Placing Order...
            </div>
          ) : (
            'Place Order'
          )}
        </Button>
      </div>

      {/* Create Address Dialog */}
      <CreateAddressDialog
        open={showCreateAddress}
        onOpenChange={setShowCreateAddress}
        onSuccess={() => {
          setShowCreateAddress(false);
          dispatch(fetchUserProfile());
        }}
      />
    </div>
  );
}

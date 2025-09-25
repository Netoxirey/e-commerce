'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCartSummary, validateCartItems } from '@/store/slices/cartSlice';
import { createOrder } from '@/store/slices/ordersSlice';
import { fetchUserProfile } from '@/store/slices/authSlice';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const checkoutSchema = z.object({
  shippingAddressId: z.string().min(1, 'Please select a shipping address'),
  billingAddressId: z.string().min(1, 'Please select a billing address'),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { summary, isValid } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const watchedFields = watch();

  useEffect(() => {
    // Fetch cart summary and validate items
    dispatch(fetchCartSummary());
    validateCart();
  }, [dispatch]);

  const validateCart = async () => {
    setIsValidating(true);
    try {
      const result = await dispatch(validateCartItems()).unwrap();
      setValidationErrors(result.errors);
    } catch (error) {
      console.error('Cart validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    console.log('Checkout form data:', data);
    console.log('Form errors:', errors);
    console.log('Watched fields:', watchedFields);
    
    if (!summary || summary.itemCount === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!isValid || validationErrors.length > 0) {
      toast.error('Please resolve cart issues before checkout');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await dispatch(createOrder({
        shippingAddressId: data.shippingAddressId,
        billingAddressId: data.billingAddressId,
        notes: data.notes,
      })).unwrap();
      
      toast.success('Order placed successfully!');
      router.push(`/orders/${order.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to checkout</h1>
          <p className="text-muted-foreground">
            You need to be signed in to complete your purchase.
          </p>
        </div>
      </div>
    );
  }

  if (!summary || summary.itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground">
            Add some items to your cart before checking out.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Cart Validation Status */}
        {isValidating ? (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Validating cart items...</span>
              </div>
            </CardContent>
          </Card>
        ) : validationErrors.length > 0 ? (
          <Alert className="mb-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-semibold">Cart validation issues:</p>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-sm">
                      {error.message || 'Unknown error'}
                    </li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your cart is ready for checkout!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <CheckoutForm
              register={register}
              errors={errors}
              watchedFields={watchedFields}
              setValue={setValue}
              onSubmit={handleSubmit(onSubmit)}
              isSubmitting={isSubmitting}
              validationErrors={validationErrors}
            />
          </div>

          {/* Order Summary */}
          <div>
            <OrderSummary summary={summary} />
          </div>
        </div>
      </div>
    </div>
  );
}

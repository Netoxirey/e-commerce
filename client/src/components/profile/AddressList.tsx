'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUserProfile } from '@/store/slices/authSlice';
import { AddressCard } from '@/components/address/AddressCard';
import { CreateAddressDialog } from '@/components/address/CreateAddressDialog';
import { EditAddressDialog } from '@/components/address/EditAddressDialog';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MapPin } from 'lucide-react';

export function AddressList() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  useEffect(() => {
    if (user && !user.addresses) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user]);

  const addresses = user?.addresses || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Addresses</h2>
          <p className="text-muted-foreground">
            Manage your shipping and billing addresses
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No addresses found</h3>
            <p className="text-muted-foreground mb-4">
              Add your first address to get started with shopping.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => setEditingAddress(address)}
              showActions
            />
          ))}
        </div>
      )}

      {/* Create Address Dialog */}
      <CreateAddressDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          setShowCreateDialog(false);
          dispatch(fetchUserProfile());
        }}
      />

      {/* Edit Address Dialog */}
      <EditAddressDialog
        address={editingAddress}
        open={!!editingAddress}
        onOpenChange={(open) => !open && setEditingAddress(null)}
        onSuccess={() => {
          setEditingAddress(null);
          dispatch(fetchUserProfile());
        }}
      />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch } from '@/store/hooks';
import { updateProfile, updateUserProfile } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { User } from '@/types';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
});

const profileDetailsSchema = z.object({
  avatar: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type ProfileDetailsFormData = z.infer<typeof profileDetailsSchema>;

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const dispatch = useAppDispatch();
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
    },
  });

  const {
    register: registerDetails,
    handleSubmit: handleSubmitDetails,
    formState: { errors: detailsErrors },
  } = useForm<ProfileDetailsFormData>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: {
      avatar: user.profile?.avatar || '',
      dateOfBirth: user.profile?.dateOfBirth || '',
      bio: user.profile?.bio || '',
      website: user.profile?.website || '',
    },
  });

  const onSubmitProfile = async (data: ProfileFormData) => {
    setIsUpdating(true);
    try {
      await dispatch(updateProfile(data)).unwrap();
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const onSubmitDetails = async (data: ProfileDetailsFormData) => {
    setIsUpdating(true);
    try {
      await dispatch(updateUserProfile(data)).unwrap();
      toast.success('Profile details updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile details');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...registerProfile('firstName')}
                  className={profileErrors.firstName ? 'border-red-500' : ''}
                />
                {profileErrors.firstName && (
                  <p className="text-sm text-red-500">{profileErrors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...registerProfile('lastName')}
                  className={profileErrors.lastName ? 'border-red-500' : ''}
                />
                {profileErrors.lastName && (
                  <p className="text-sm text-red-500">{profileErrors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...registerProfile('email')}
                className={profileErrors.email ? 'border-red-500' : ''}
              />
              {profileErrors.email && (
                <p className="text-sm text-red-500">{profileErrors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                {...registerProfile('phone')}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Updating...
                </div>
              ) : (
                'Update Profile'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitDetails(onSubmitDetails)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                {...registerDetails('avatar')}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...registerDetails('dateOfBirth')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...registerDetails('bio')}
                placeholder="Tell us about yourself..."
                rows={3}
                className={detailsErrors.bio ? 'border-red-500' : ''}
              />
              {detailsErrors.bio && (
                <p className="text-sm text-red-500">{detailsErrors.bio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                {...registerDetails('website')}
                placeholder="https://yourwebsite.com"
                className={detailsErrors.website ? 'border-red-500' : ''}
              />
              {detailsErrors.website && (
                <p className="text-sm text-red-500">{detailsErrors.website.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Updating...
                </div>
              ) : (
                'Update Details'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

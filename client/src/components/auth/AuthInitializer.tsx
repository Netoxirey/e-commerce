'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { restoreAuthState } from '@/store/slices/authSlice';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Restore authentication state from stored tokens on app initialization
    const initializeAuth = async () => {
      try {
        await dispatch(restoreAuthState());
      } catch (error) {
        // Auth restoration failed, but we still need to show the app
        console.warn('Failed to restore auth state:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    initializeAuth();
  }, [dispatch]);

  // Show loading spinner while initializing auth state
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}

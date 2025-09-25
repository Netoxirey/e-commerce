'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/slices/productsSlice';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

export function ProductGrid() {
  const dispatch = useAppDispatch();
  const { products, isLoading, pagination } = useAppSelector((state: any) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 8 }));
  }, [dispatch]);

  const handleLoadMore = () => {
    if (pagination && pagination.page < pagination.totalPages) {
      dispatch(fetchProducts({
        page: pagination.page + 1,
        limit: 8,
      }));
    }
  };

  if (isLoading && (!products || products.length === 0)) {
    return (
      <div className="py-12">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold">Latest Products</h2>
      </div>
      
      {!products || products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No products found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} viewMode="grid" />
            ))}
          </div>
          
          {pagination && pagination.page < pagination.totalPages && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Loading...
                  </div>
                ) : (
                  'Load More Products'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

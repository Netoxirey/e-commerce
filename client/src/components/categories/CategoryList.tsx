'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCategories } from '@/store/slices/productsSlice';
import { CategoryCard } from './CategoryCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function CategoryList() {
  const dispatch = useAppDispatch();
  const { categories, isLoading } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (isLoading) {
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
      <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
      
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No categories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </section>
  );
}

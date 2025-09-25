import { Suspense } from 'react';
import { ProductGrid } from '@/components/products/ProductGrid';
import { CategoryList } from '@/components/categories/CategoryList';
import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <CategoryList />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          <FeaturedProducts />
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          <ProductGrid />
        </Suspense>
      </div>
    </div>
  );
}

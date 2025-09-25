'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts, fetchCategories } from '@/store/slices/productsSlice';
import { ProductCard } from '@/components/products/ProductCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, Category } from '@/types';
import { Search, ArrowLeft, Grid, List, Filter } from 'lucide-react';

export default function CategoryProductsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  
  const { 
    products, 
    categories, 
    isLoading, 
    pagination 
  } = useAppSelector((state: any) => state.products);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categorySlug = params.slug as string;
  const currentCategory = categories?.find((cat: Category) => cat.slug === categorySlug);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (currentCategory) {
      const queryParams = new URLSearchParams();
      
      if (search) queryParams.set('search', search);
      if (minPrice) queryParams.set('minPrice', minPrice);
      if (maxPrice) queryParams.set('maxPrice', maxPrice);
      if (sortBy) queryParams.set('sortBy', sortBy);
      if (sortOrder) queryParams.set('sortOrder', sortOrder);

      const newQuery = queryParams.toString();
      const currentQuery = searchParams.toString();
      
      if (newQuery !== currentQuery) {
        router.push(`/categories/${categorySlug}?${newQuery}`);
      }
    }
  }, [search, minPrice, maxPrice, sortBy, sortOrder, router, searchParams, categorySlug, currentCategory]);

  useEffect(() => {
    if (currentCategory) {
      const query = {
        page: 1,
        limit: 12,
        categoryId: currentCategory.id,
        search: search || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy,
        sortOrder: sortOrder as 'asc' | 'desc',
      };

      dispatch(fetchProducts(query));
    }
  }, [dispatch, currentCategory, search, minPrice, maxPrice, sortBy, sortOrder]);

  const handleLoadMore = () => {
    if (pagination && pagination.page < pagination.totalPages && currentCategory) {
      const query = {
        page: pagination.page + 1,
        limit: 12,
        categoryId: currentCategory.id,
        search: search || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy,
        sortOrder: sortOrder as 'asc' | 'desc',
      };
      dispatch(fetchProducts(query));
    }
  };

  if (isLoading && !currentCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Category not found</h1>
            <p className="text-muted-foreground mb-6">
              The category you're looking for doesn't exist.
            </p>
            <Button asChild>
              <Link href="/categories">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-foreground">Categories</Link>
          <span>/</span>
          <span className="text-foreground">{currentCategory.name}</span>
        </div>

        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/categories">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Categories
                  </Link>
                </Button>
                <Badge variant={currentCategory.isActive ? "default" : "destructive"}>
                  {currentCategory.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{currentCategory.name}</h1>
              
              {currentCategory.description && (
                <p className="text-lg text-muted-foreground mb-4 max-w-2xl">
                  {currentCategory.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{pagination?.total || 0} products</span>
                {currentCategory._count?.products && (
                  <span>• {currentCategory._count.products} total in this category</span>
                )}
              </div>
            </div>

            {/* Category Image */}
            {currentCategory.image && (
              <div className="ml-8">
                <div className="w-32 h-32 relative rounded-lg overflow-hidden">
                  <Image
                    src={currentCategory.image}
                    alt={currentCategory.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5" />
                  <h3 className="font-semibold">Filters</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search in {currentCategory.name}..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price Range</label>
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort By</label>
                    <div className="space-y-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="createdAt">Newest</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="price">Price</SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="desc">Descending</SelectItem>
                          <SelectItem value="asc">Ascending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  {pagination?.total || 0} products in {currentCategory.name}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid/List */}
            {isLoading && (!products || products.length === 0) ? (
              <div className="py-12">
                <div className="flex justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              </div>
            ) : !products || products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No products found in {currentCategory.name}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <>
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }>
                  {products.map((product: Product) => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                  ))}
                </div>

                {/* Load More Button */}
                {pagination && pagination.page < pagination.totalPages && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      variant="outline"
                      size="lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <LoadingSpinner size="sm" />
                          Loading...
                        </div>
                      ) : (
                        'Load More Products'
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

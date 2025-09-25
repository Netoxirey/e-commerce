'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <Link href={`/categories/${category.slug}`}>
        <CardContent className="p-4 text-center">
          <div className="aspect-square relative mb-4 rounded-lg overflow-hidden">
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-2xl">📦</span>
              </div>
            )}
          </div>
          
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          
          {category.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {category.description}
            </p>
          )}
          
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-xs">
              {category._count?.products || 0} products
            </Badge>
            {!category.isActive && (
              <Badge variant="destructive" className="text-xs">
                Inactive
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

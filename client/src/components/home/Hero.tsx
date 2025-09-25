'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Star, Truck } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-primary to-primary/80 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Our
            <span className="block text-yellow-300">E-commerce Store</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
            Discover amazing products at unbeatable prices. Shop with confidence
            and enjoy fast, reliable delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <Link href="/categories">
                Browse Categories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Features */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
            <p className="text-primary-foreground/80">
              Free delivery on orders over $50
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Star className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Quality Guarantee</h3>
            <p className="text-primary-foreground/80">
              30-day money-back guarantee
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Wide Selection</h3>
            <p className="text-primary-foreground/80">
              Thousands of products to choose from
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

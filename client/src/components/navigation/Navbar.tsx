'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X,
  Package,
  Grid3X3,
  ShoppingBag,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector((state: any) => state.cart);
  const { user, isAuthenticated } = useAppSelector((state: any) => state.auth);

  const cartItemsCount = cartItems?.reduce((total: number, item: any) => total + item.quantity, 0) || 0;

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully');
      setIsMenuOpen(false);
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">E-commerce</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Button */}
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>

            {/* Cart - Only show if authenticated */}
            {isAuthenticated && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/cart" className="relative">
                  <ShoppingCart className="h-4 w-4" />
                  {cartItemsCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            )}

            {/* Orders - Only show if authenticated */}
            {isAuthenticated && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/orders">
                  <Package className="h-4 w-4" />
                </Link>
              </Button>
            )}

            {/* Authentication Buttons */}
            {isAuthenticated ? (
              <>
                {/* User Greeting */}
                <span className="text-sm text-gray-600 hidden lg:block">
                  Welcome, {user?.firstName || user?.email}
                </span>
                
                {/* Profile */}
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
                
                {/* Logout */}
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                {/* Login */}
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">
                    <LogIn className="h-4 w-4" />
                  </Link>
                </Button>
                
                {/* Signup */}
                <Button variant="default" size="sm" asChild>
                  <Link href="/auth/signup">
                    <UserPlus className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t pt-2 mt-2">
                {isAuthenticated ? (
                  <>
                    {/* Cart */}
                    <Link
                      href="/cart"
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cart
                      {cartItemsCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {cartItemsCount}
                        </Badge>
                      )}
                    </Link>
                    
                    {/* Orders */}
                    <Link
                      href="/orders"
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Orders
                    </Link>
                    
                    {/* Profile */}
                    <Link
                      href="/profile"
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    
                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {/* Login */}
                    <Link
                      href="/auth/login"
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                    
                    {/* Signup */}
                    <Link
                      href="/auth/signup"
                      className="flex items-center px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

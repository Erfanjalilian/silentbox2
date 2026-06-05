// components/Header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // useCart() may have different shape depending on context type definitions.
  // Coerce to any to safely access possible cart or items properties.
  const cartContext = useCart();
  const cart = (cartContext as any)?.cart ?? (cartContext as any)?.items ?? [];
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const cartCount = cart?.length || 0;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const accountHref = isAuthenticated ? (user?.role === 'admin' ? '/admin/users' : '/dashboard') : '/login';
  const accountLabel = isLoading
    ? '…'
    : isAuthenticated
      ? 'حساب کاربری'
      : 'ورود';

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-gray-900 to-gray-800 border-b border-sky-500/30 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo / Brand */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl md:text-3xl font-bold tracking-tight">
                <span className="text-sky-400">Silent</span>
                <span className="text-orange-500">Box</span>
              </Link>
            </div>

            {/* Desktop Navigation Links - hidden on mobile */}
            <nav className="hidden md:flex items-center gap-12 mr-10">
              <Link href="/" className="text-gray-300 hover:text-sky-400 transition-colors duration-200 font-medium">
                صفحه اصلی
              </Link>
              <Link href="/products" className="text-gray-300 hover:text-sky-400 transition-colors duration-200 font-medium">
                محصولات
              </Link>
              <Link href="/portfolio" className="text-gray-300 hover:text-sky-400 transition-colors duration-200 font-medium">
                نمونه کارها
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-sky-400 transition-colors duration-200 font-medium">
                تماس با ما
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-sky-400 transition-colors duration-200 font-medium">
                درباره ما
              </Link>
              <Link href="/videos" className="text-gray-300 hover:text-sky-400 transition-colors duration-200 font-medium">
                تست صدا
              </Link>
            </nav>

            {/* Right side icons: Payment Button, User, Menu (mobile) */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Payment Button - replaces cart icon */}
              <Link 
                href="/payment" 
                className="relative bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
              >
                شیوه ی پرداخت
              </Link>

              {isAuthenticated && user?.role === 'admin' && (
                <Link
                  href="/admin/users"
                  className="hidden sm:inline text-sm text-sky-400/90 hover:text-sky-300 transition-colors"
                >
                  مدیریت
                </Link>
              )}
              {/* User account */}
              {isAuthenticated && user ? (
                <Link
                  href={accountHref}
                  className="hidden sm:inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-sm text-sky-100 transition-colors hover:bg-sky-500/20"
                  aria-label="حساب کاربری"
                >
                  <UserIcon className="h-5 w-5" />
                  <span className="truncate max-w-[8rem] text-sm text-sky-100">
                    {user.firstName ? `${user.firstName} ${user.lastName}` : user.phone}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:inline-flex text-gray-300 hover:text-sky-400 transition-colors"
                  aria-label="ورود"
                >
                  <UserIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={toggleMobileMenu}
                className="md:hidden text-gray-300 hover:text-sky-400 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          />
          
          {/* Mobile Menu Panel */}
          <div className="absolute top-16 right-0 bottom-0 w-64 bg-gradient-to-b from-gray-800 to-gray-900 border-l border-sky-500/30 shadow-xl animate-slide-in">
            <nav className="flex flex-col py-8 px-6 space-y-6">
              <Link 
                href="/" 
                onClick={toggleMobileMenu}
                className="text-gray-300 hover:text-sky-400 transition-colors duration-200 font-medium text-lg"
              >
                صفحه اصلی
              </Link>
              <Link 
                href="/products" 
                onClick={toggleMobileMenu}
                className="text-gray-300 hover:text-sky-400 transition-colors duration-200 font-medium text-lg"
              >
                محصولات
              </Link>
              <Link 
                href="/portfolio" 
                onClick={toggleMobileMenu}
                className="text-gray-300 hover:text-sky-400 transition-colors duration-200 font-medium text-lg"
              >
                نمونه کارها
              </Link>
              <Link 
                href="/contact" 
                onClick={toggleMobileMenu}
                className="text-gray-300 hover:text-sky-400 transition-colors duration-200 font-medium text-lg"
              >
                تماس با ما
              </Link>
              <Link 
                href="/about" 
                onClick={toggleMobileMenu}
                className="text-gray-300 hover:text-sky-400 transition-colors duration-200 font-medium text-lg"
              >
                درباره ما
              </Link>
              <Link 
                href="/videos" 
                onClick={toggleMobileMenu}
                className="text-gray-300 hover:text-sky-400 transition-colors duration-200 font-medium text-lg"
              >
                تست صدا
              </Link>
              
              {/* Payment link in mobile menu */}
              <Link 
                href="/payment" 
                onClick={toggleMobileMenu}
                className="flex items-center justify-between text-gray-300 hover:text-sky-400 transition-colors duration-200 font-medium text-lg"
              >
                <span>شیوه ی پرداخت</span>
              </Link>
              
              <div className="pt-6 border-t border-sky-500/30 space-y-4">
                <Link
                  href={accountHref}
                  onClick={toggleMobileMenu}
                  className="w-full flex items-center justify-between text-gray-300 hover:text-sky-400 transition-colors"
                >
                  <span>
                  {isAuthenticated && user
                    ? user.firstName
                      ? `${user.firstName} ${user.lastName}`
                      : user.phone
                    : accountLabel}
                </span>
                  <UserIcon className="h-5 w-5" />
                </Link>
                {isAuthenticated && user?.role === 'admin' && (
                  <Link
                    href="/admin/users"
                    onClick={toggleMobileMenu}
                    className="block text-gray-300 hover:text-sky-400 transition-colors"
                  >
                    پنل مدیریت
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Header;
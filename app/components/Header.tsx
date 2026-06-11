// components/Header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartContext = useCart();
  const cart = (cartContext as any)?.cart ?? (cartContext as any)?.items ?? [];
  
  const cartCount = cart?.length || 0;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

            {/* Right side icons */}
            <div className="flex items-center gap-3 sm:gap-5">
              {/* Payment Button */}
              <Link 
                href="/payment" 
                className="relative bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
              >
                شیوه ی پرداخت
              </Link>

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
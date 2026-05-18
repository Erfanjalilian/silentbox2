// app/cart/page.tsx and 
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  PhotoIcon, 
  TrashIcon, 
  PlusIcon, 
  MinusIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  const subtotal = getCartTotal();
  
  // هزینه بسته‌بندی: 250,000 تومان به ازای هر محصول
  const packagingCostPerItem = 250000;
  const totalPackagingCost = cart.length * packagingCostPerItem;
  
  // جمع کل با احتساب هزینه بسته‌بندی
  const total = subtotal + totalPackagingCost;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="h-16 md:h-20"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gray-800 rounded-2xl p-12 border border-gray-700">
              <ShoppingBagIcon className="h-24 w-24 text-gray-600 mx-auto mb-6" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-4">
                سبد خرید خالی است
              </h1>
              <p className="text-gray-400 mb-8">
                هنوز محصولی به سبد خرید خود اضافه نکرده‌اید
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
              >
                <ArrowRightIcon className="h-5 w-5" />
                شروع خرید
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="h-16 md:h-20"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">
              سبد خرید
            </h1>
            <p className="text-gray-400">
              {cart.length} محصول در سبد خرید شما وجود دارد
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const hasImage = item.imageUrl && item.imageUrl.trim() !== '';
                const itemTotal = item.price * item.quantity;
                
                return (
                  <div key={item.id} className="bg-gray-800 rounded-xl border border-gray-700 p-4 hover:border-sky-500/30 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <Link href={`/products/${item.id}`} className="sm:w-32 flex-shrink-0">
                        <div className="relative h-32 w-full rounded-lg overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
                          {hasImage ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <PhotoIcon className="h-8 w-8 text-sky-500/30" />
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <Link href={`/products/${item.id}`}>
                              <h3 className="text-gray-100 font-semibold text-lg hover:text-sky-400 transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-sky-400 text-xs mt-1">
                              {item.category === 'silentbox' ? 'سیلنت‌باکس' : 'لوازم جانبی'}
                            </p>
                            {item.discount > 0 && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-sky-400 text-sm font-bold">
                                  {formatPrice(item.price)}
                                </span>
                                <span className="text-gray-500 text-xs line-through">
                                  {formatPrice(item.originalPrice)}
                                </span>
                                <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                                  {item.discount}٪
                                </span>
                              </div>
                            )}
                            {item.discount === 0 && (
                              <div className="mt-2">
                                <span className="text-sky-400 text-sm font-bold">
                                  {formatPrice(item.price)}
                                </span>
                              </div>
                            )}
                            
                            {/* هزینه بسته‌بندی هر محصول */}
                            <div className="flex items-center gap-1 mt-2">
                              <CubeIcon className="h-3 w-3 text-gray-500" />
                              <span className="text-gray-500 text-xs">
                                هزینه بسته‌بندی: {formatPrice(packagingCostPerItem)}
                              </span>
                            </div>
                          </div>

                          {/* Total Price */}
                          <div className="text-left sm:text-right">
                            <p className="text-gray-100 font-bold text-lg">
                              {formatPrice(itemTotal)}
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controls and Remove */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
                            >
                              <MinusIcon className="h-4 w-4" />
                            </button>
                            <span className="text-gray-100 font-semibold w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
                            >
                              <PlusIcon className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-1 text-sm"
                          >
                            <TrashIcon className="h-4 w-4" />
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Clear Cart Button */}
              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-400 text-sm transition-colors flex items-center gap-1"
                >
                  <TrashIcon className="h-4 w-4" />
                  حذف همه
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 sticky top-24">
                <h2 className="text-gray-100 font-bold text-xl mb-6 pb-4 border-b border-gray-700">
                  خلاصه سفارش
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>مجموع سبد خرید</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  
                  {/* هزینه بسته‌بندی */}
                  <div className="flex justify-between text-gray-400">
                    <div className="flex items-center gap-1">
                      <CubeIcon className="h-4 w-4" />
                      <span>هزینه بسته‌بندی {cart.length > 1 ? `(${cart.length} عدد)` : ''}</span>
                    </div>
                    <span>{formatPrice(totalPackagingCost)}</span>
                  </div>
                  
                  {/* توضیح هزینه بسته‌بندی هر محصول */}
                  {cart.length > 0 && (
                    <div className="text-xs text-gray-500 pr-5">
                      {cart.length} محصول × {formatPrice(packagingCostPerItem)} = {formatPrice(totalPackagingCost)}
                    </div>
                  )}
                  
                  <div className="border-t border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between text-gray-100 font-bold text-lg">
                      <span>جمع کل</span>
                      <span className="text-sky-400">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                {/* اطلاعیه هزینه بسته‌بندی */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-6">
                  <p className="text-blue-400 text-sm text-center">
                    📦 هزینه بسته‌بندی {formatPrice(packagingCostPerItem)} تومان به ازای هر محصول محاسبه شده است
                  </p>
                </div>

                <button
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 mb-3"
                >
                  ادامه فرآیند خرید
                </button>

                <Link
                  href="/products"
                  className="block text-center text-gray-400 hover:text-sky-400 text-sm transition-colors"
                >
                  ادامه خرید
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
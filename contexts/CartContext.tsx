// contexts/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types/product';

// تایپ آیتم سبد خرید
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  discountPercent: number;
  quantity: number;
  imageUrl: string;
  image?: string; // برای سازگاری
  inStock: boolean;
  maxStock?: number;
}

// تایپ کانتکس سبد خرید
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalDiscount: () => number;
  getFinalPrice: () => number;
  getItemCount: () => number;
  getUniqueItemCount: () => number;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// کلید ذخیره در localStorage
const CART_STORAGE_KEY = 'shopping_cart';

// تابع کمکی برای ذخیره در localStorage
const saveCartToLocalStorage = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }
};

// تابع کمکی برای بارگذاری از localStorage
const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        return [];
      }
    }
  }
  return [];
};

// تابع برای گرفتن عکس اصلی محصول
const getMainImage = (product: Product): string => {
  if (product.images && product.images.length > 0) {
    return product.images[0];
  }
  return product.imageUrl || '';
};

// تابع برای گرفتن درصد تخفیف
const getDiscountPercent = (product: Product): number => {
  return product.discountPercent || product.discount || 0;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // بارگذاری از localStorage در اولین رندر
  useEffect(() => {
    const savedCart = loadCartFromLocalStorage();
    if (savedCart.length > 0) {
      setItems(savedCart);
    }
    setIsInitialized(true);
  }, []);

  // ذخیره در localStorage هر بار که سبد خرید تغییر می‌کند
  useEffect(() => {
    if (isInitialized) {
      saveCartToLocalStorage(items);
    }
  }, [items, isInitialized]);

  // افزودن به سبد خرید
  const addToCart = (product: Product, quantity: number = 1) => {
    if (!product.inStock) {
      console.warn('Product is out of stock');
      return;
    }

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      const discountPercent = getDiscountPercent(product);
      const mainImage = getMainImage(product);
      
      if (existingItem) {
        // افزایش تعداد
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // اضافه کردن محصول جدید
        const newItem: CartItem = {
          id: product.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          discountPercent: discountPercent,
          quantity: quantity,
          imageUrl: mainImage,
          image: mainImage,
          inStock: product.inStock,
        };
        return [...prevItems, newItem];
      }
    });
  };

  // حذف از سبد خرید
  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // به‌روزرسانی تعداد
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // خالی کردن سبد خرید
  const clearCart = () => {
    setItems([]);
  };

  // محاسبه مجموع قیمت (قبل از تخفیف)
  const getTotalPrice = (): number => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // محاسبه مجموع تخفیف
  const getTotalDiscount = (): number => {
    return items.reduce((total, item) => {
      if (item.originalPrice > item.price) {
        const discount = item.originalPrice - item.price;
        return total + (discount * item.quantity);
      }
      return total;
    }, 0);
  };

  // محاسبه قیمت نهایی (بعد از تخفیف)
  const getFinalPrice = (): number => {
    return getTotalPrice();
  };

  // محاسبه تعداد کل آیتم‌ها (با احتساب تعداد هر محصول)
  const getItemCount = (): number => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  // محاسبه تعداد محصولات منحصر به فرد
  const getUniqueItemCount = (): number => {
    return items.length;
  };

  // بررسی وجود محصول در سبد خرید
  const isInCart = (productId: string): boolean => {
    return items.some(item => item.id === productId);
  };

  // گرفتن تعداد یک محصول خاص
  const getItemQuantity = (productId: string): number => {
    const item = items.find(item => item.id === productId);
    return item?.quantity || 0;
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalDiscount,
    getFinalPrice,
    getItemCount,
    getUniqueItemCount,
    isInCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// هوک سفارشی برای استفاده از سبد خرید
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
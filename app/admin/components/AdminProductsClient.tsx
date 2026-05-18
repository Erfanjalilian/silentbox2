// app/admin/components/AdminProductsClient.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  imageUrl: string;
  category: string;
  inStock: boolean;
  isBestSeller: boolean;
  badge: string | null;
}

interface AdminProductsClientProps {
  initialProducts: Product[];
}

const AdminProductsClient: React.FC<AdminProductsClientProps> = ({ initialProducts }) => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!selectedProduct) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProducts(products.filter(p => p.id !== selectedProduct.id));
        setShowDeleteModal(false);
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* Search Bar */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
        <input
          type="text"
          placeholder="جستجوی محصول..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 placeholder-gray-500"
        />
      </div>

      {/* Products Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="text-right p-4 text-gray-300 font-semibold">محصول</th>
                <th className="text-right p-4 text-gray-300 font-semibold">دسته‌بندی</th>
                <th className="text-right p-4 text-gray-300 font-semibold">قیمت</th>
                <th className="text-right p-4 text-gray-300 font-semibold">تخفیف</th>
                <th className="text-right p-4 text-gray-300 font-semibold">موجودی</th>
                <th className="text-right p-4 text-gray-300 font-semibold">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-gray-100 font-medium">{product.name}</p>
                      <p className="text-gray-500 text-sm line-clamp-1">{product.description}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sky-400 text-sm">
                      {product.category === 'silentbox' ? 'سیلنت‌باکس' : 'لوازم جانبی'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-100 text-sm">{formatPrice(product.price)}</span>
                  </td>
                  <td className="p-4">
                    {product.discount > 0 ? (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        {product.discount}٪
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    {product.inStock ? (
                      <span className="text-green-500 text-sm">✓ موجود</span>
                    ) : (
                      <span className="text-red-500 text-sm">✗ ناموجود</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      <Link
                        href={`/products/${product.id}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">محصولی یافت نشد</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-gray-100 mb-4">حذف محصول</h3>
            <p className="text-gray-400 mb-6">
              آیا از حذف محصول &quot;{selectedProduct.name}&quot; اطمینان دارید؟
              <br />
              <span className="text-red-400 text-sm">این عملیات غیرقابل بازگشت است.</span>
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? 'در حال حذف...' : 'حذف'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProductsClient;
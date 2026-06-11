// app/admin/layout.tsx
import React from 'react';

/** Admin panel uses live data; never statically prerender at build time. */
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { ShoppingBagIcon, HomeIcon } from '@heroicons/react/24/outline';
import AdminLogoutButton from '@/app/admin/components/AdminLogoutButton';

const menuItems = [
  {
    name: 'مدیریت محصولات',
    href: '/admin/products',
    icon: ShoppingBagIcon,
    description: 'افزودن، ویرایش و حذف محصولات',
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="fixed right-0 top-0 h-screen w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto z-50 hidden lg:block">
          <div className="p-6">
            {/* Logo */}
            <div className="mb-8 pb-6 border-b border-gray-700">
              <Link href="/admin/products" className="text-2xl font-bold">
                <span className="text-gray-100">پنل</span>
                <span className="text-sky-400">مدیریت</span>
              </Link>
              <p className="text-gray-500 text-sm mt-2">مدیریت محصولات فروشگاه</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-4 p-3 rounded-lg text-gray-400 hover:text-sky-400 hover:bg-gray-700 transition-all duration-200 group"
                  >
                    <Icon className="h-6 w-6" />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500 group-hover:text-gray-400">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-700 space-y-3">
              <Link
                href="/"
                className="flex items-center gap-3 text-gray-400 hover:text-sky-400 transition-colors p-3 rounded-lg hover:bg-gray-700/50"
              >
                <HomeIcon className="h-5 w-5" />
                <span>بازگشت به سایت</span>
              </Link>
              <AdminLogoutButton />
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 right-0 left-0 bg-gray-800 border-b border-gray-700 z-50">
          <div className="flex items-center justify-between p-4">
            <Link href="/admin/products" className="text-xl font-bold">
              <span className="text-gray-100">پنل</span>
              <span className="text-sky-400">مدیریت</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="text-sm text-gray-400 hover:text-sky-400 transition-colors px-2"
              >
                سایت
              </Link>
              <AdminLogoutButton compact />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:mr-80">
          <div className="lg:mt-0 mt-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

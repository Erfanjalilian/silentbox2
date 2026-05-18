// app/admin/users/page.tsx
import React, { Suspense } from 'react';
import Link from 'next/link';
import AdminUsersClient from '@/app/admin/components/AdminUsersClient';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

async function getAllUsers(): Promise<User[]> {
  const { getAllUsers: loadUsers } = await import('@/lib/data/users');
  return loadUsers();
}

function UsersLoading() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="h-8 bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-700 rounded w-96 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-4 animate-pulse">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-5 bg-gray-700 rounded w-48"></div>
                <div className="h-4 bg-gray-700 rounded w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function AdminUsersPage() {
  const users = await getAllUsers();
  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-2">
            مدیریت کاربران
          </h1>
          <p className="text-gray-400">
            لیست کاربران فروشگاه - {users.length} کاربر فعال - {adminCount} ادمین
          </p>
          <p className="text-sky-400 text-sm mt-2">
            ℹ️ این بخش فقط قابلیت مشاهده دارد. مدیریت کاربران از طریق بخش مجزا انجام می‌شود.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <Suspense fallback={<UsersLoading />}>
        <AdminUsersClient initialUsers={users} />
      </Suspense>
    </div>
  );
}
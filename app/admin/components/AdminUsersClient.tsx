// app/admin/components/AdminUsersClient.tsx
'use client';

import React, { useState } from 'react';
import { UserIcon, UserCircleIcon, EyeIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

interface AdminUsersClientProps {
  initialUsers: User[];
}

const AdminUsersClient: React.FC<AdminUsersClientProps> = ({ initialUsers }) => {
  const [users] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.trim();
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.phoneNumber.includes(searchTerm);
  });

  const getFullName = (user: User) => {
    const fullName = `${user.firstName} ${user.lastName}`.trim();
    return fullName || 'کاربر بدون نام';
  };

  return (
    <>
      {/* Search Bar */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
        <input
          type="text"
          placeholder="جستجوی کاربر بر اساس نام یا شماره تلفن..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-900 text-gray-100 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 placeholder-gray-500"
        />
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="text-right p-4 text-gray-300 font-semibold">نام و نام خانوادگی</th>
                <th className="text-right p-4 text-gray-300 font-semibold">شماره تلفن</th>
                <th className="text-right p-4 text-gray-300 font-semibold">نقش</th>
                <th className="text-right p-4 text-gray-300 font-semibold">تاریخ عضویت</th>
                <th className="text-right p-4 text-gray-300 font-semibold">آخرین بروزرسانی</th>
               </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-100 font-medium">{getFullName(user)}</p>
                      </div>
                    </div>
                   </td>
                  <td className="p-4">
                    <span className="text-gray-300 text-sm">{user.phoneNumber}</span>
                   </td>
                  <td className="p-4">
                    {user.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 bg-sky-500/20 text-sky-400 text-xs px-2 py-1 rounded-full">
                        <UserCircleIcon className="h-3 w-3" />
                        ادمین
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-gray-500/20 text-gray-400 text-xs px-2 py-1 rounded-full">
                        <UserIcon className="h-3 w-3" />
                        کاربر عادی
                      </span>
                    )}
                   </td>
                  <td className="p-4">
                    <span className="text-gray-400 text-sm">{user.createdAt}</span>
                   </td>
                  <td className="p-4">
                    <span className="text-gray-400 text-sm">{user.updatedAt}</span>
                   </td>
                </tr>
              ))}
            </tbody>
           </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">کاربری یافت نشد</p>
          </div>
        )}
      </div>

      {/* View Only Notice */}
      <div className="mt-6 p-4 bg-sky-500/10 border border-sky-500/30 rounded-lg text-center">
        <p className="text-sky-400 text-sm flex items-center justify-center gap-2">
          <EyeIcon className="h-4 w-4" />
          این بخش فقط برای مشاهده کاربران است. برای افزودن، ویرایش یا حذف کاربران، از بخش مدیریت مجزا استفاده کنید.
        </p>
      </div>
    </>
  );
};

export default AdminUsersClient;
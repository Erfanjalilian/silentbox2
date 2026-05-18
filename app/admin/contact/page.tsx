// app/admin/contact/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
  reply?: string;
  repliedAt?: string;
}

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replyText, setReplyText] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: statusFilter,
        ...(searchTerm && { search: searchTerm })
      });
      
      const response = await fetch(`/api/admin/contacts?${params}`);
      const data = await response.json();
      setMessages(data.contacts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currentPage, statusFilter, searchTerm]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      
      if (response.ok) {
        fetchMessages();
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, status: status as any });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('آیا از حذف این پیام اطمینان دارید؟')) return;
    
    try {
      const response = await fetch(`/api/admin/contacts?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchMessages();
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;
    
    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: selectedMessage.id, 
          status: 'replied',
          reply: replyText 
        })
      });
      
      if (response.ok) {
        setShowReplyModal(false);
        setReplyText('');
        fetchMessages();
        alert('پاسخ با موفقیت ارسال شد');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">در انتظار</span>;
      case 'read':
        return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">خوانده شده</span>;
      case 'replied':
        return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">پاسخ داده شده</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">مدیریت پیام‌های تماس</h1>
          <p className="text-gray-400">مدیریت و پاسخگویی به پیام‌های کاربران</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 rounded-xl p-4 mb-6 backdrop-blur-sm border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="جستجو در نام، ایمیل، یا متن پیام..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-sky-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-sky-500"
            >
              <option value="all">همه پیام‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="read">خوانده شده</option>
              <option value="replied">پاسخ داده شده</option>
            </select>
            <button
              onClick={fetchMessages}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
            >
              <ArrowPathIcon className="h-5 w-5" />
              بروزرسانی
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">کل پیام‌ها</p>
                <p className="text-2xl font-bold text-white">{messages.length}</p>
              </div>
              <EnvelopeIcon className="h-8 w-8 text-sky-500" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">در انتظار پاسخ</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {messages.filter(m => m.status === 'pending').length}
                </p>
              </div>
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">پاسخ داده شده</p>
                <p className="text-2xl font-bold text-green-400">
                  {messages.filter(m => m.status === 'replied').length}
                </p>
              </div>
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden backdrop-blur-sm">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-white font-semibold">لیست پیام‌ها</h2>
            </div>
            <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-400">در حال بارگذاری...</div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center text-gray-400">پیامی یافت نشد</div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-4 cursor-pointer transition-all duration-300 hover:bg-gray-700/50 ${
                      selectedMessage?.id === message.id ? 'bg-gray-700/70 border-r-4 border-sky-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-white font-medium">{message.name}</p>
                        <p className="text-gray-400 text-sm">{message.email}</p>
                      </div>
                      {getStatusBadge(message.status)}
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-2 mb-2">{message.message}</p>
                    <p className="text-gray-500 text-xs">{formatDate(message.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-700 flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-700 rounded-lg text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  قبلی
                </button>
                <span className="text-gray-400">صفحه {currentPage} از {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-700 rounded-lg text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  بعدی
                </button>
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm">
                <div className="p-4 border-b border-gray-700 flex justify-between items-start">
                  <div>
                    <h2 className="text-white font-semibold text-lg">جزئیات پیام</h2>
                    <p className="text-gray-400 text-sm">شناسه: #{selectedMessage.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(selectedMessage.id, 'read')}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all"
                      title="علامت‌گذاری به عنوان خوانده شده"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setReplyText('');
                        setShowReplyModal(true);
                      }}
                      className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all"
                      title="پاسخ به پیام"
                    >
                      <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteMessage(selectedMessage.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all"
                      title="حذف پیام"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <UserIcon className="h-5 w-5 text-sky-500 mt-0.5" />
                      <div>
                        <p className="text-gray-400 text-sm">نام و نام خانوادگی</p>
                        <p className="text-white">{selectedMessage.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <EnvelopeIcon className="h-5 w-5 text-sky-500 mt-0.5" />
                      <div>
                        <p className="text-gray-400 text-sm">ایمیل</p>
                        <p className="text-white">{selectedMessage.email}</p>
                      </div>
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-start gap-3">
                        <PhoneIcon className="h-5 w-5 text-sky-500 mt-0.5" />
                        <div>
                          <p className="text-gray-400 text-sm">شماره تماس</p>
                          <p className="text-white">{selectedMessage.phone}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 text-sky-500 mt-0.5" />
                      <div>
                        <p className="text-gray-400 text-sm">موضوع</p>
                        <p className="text-white">{selectedMessage.subject}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-sm mb-2">متن پیام</p>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <p className="text-gray-200 whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>
                  </div>
                  
                  {selectedMessage.reply && (
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-green-400 text-sm mb-2">پاسخ ارسال شده</p>
                      <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                        <p className="text-gray-200 whitespace-pre-wrap">{selectedMessage.reply}</p>
                        <p className="text-gray-500 text-xs mt-2">
                          ارسال شده در: {formatDate(selectedMessage.repliedAt || '')}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 text-right text-gray-500 text-xs">
                    تاریخ ارسال: {formatDate(selectedMessage.createdAt)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-12 text-center backdrop-blur-sm">
                <EnvelopeIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">برای مشاهده جزئیات، روی یک پیام کلیک کنید</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full border border-gray-700">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-white font-semibold">پاسخ به پیام {selectedMessage.name}</h3>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="متن پاسخ خود را وارد کنید..."
                rows={6}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowReplyModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
              >
                انصراف
              </button>
              <button
                onClick={sendReply}
                disabled={!replyText.trim()}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ارسال پاسخ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
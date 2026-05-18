// app/contact/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  PhotoIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface ContactData {
  title: string;
  description: string;
  hero: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  contactInfo: {
    email: {
      primary: string;
      support: string;
      sales: string;
    };
    phone: {
      primary: string;
      support: string;
      mobile: string;
      whatsapp: string;
    };
    address: {
      office: string;
      factory: string;
      mapUrl: string;
    };
    workingHours: {
      weekdays: string;
      thursday: string;
      friday: string;
    };
  };
  form: {
    title: string;
    subtitle: string;
    fields: {
      name: { label: string; placeholder: string; required: boolean };
      email: { label: string; placeholder: string; required: boolean };
      phone: { label: string; placeholder: string; required: boolean };
      subject: { label: string; placeholder: string; required: boolean; options: string[] };
      message: { label: string; placeholder: string; required: boolean };
    };
    submitButton: string;
    successMessage: string;
    errorMessage: string;
  };
  socialMedia: {
    title: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    telegram: string;
    whatsapp: string;
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
}

export default function ContactPage() {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/contact');
        
        if (!response.ok) {
          throw new Error('Failed to fetch contact data');
        }
        
        const data = await response.json();
        setContactData(data);
        setError(null);
      } catch (err) {
        setError('خطا در بارگذاری اطلاعات تماس');
        console.error('Error fetching contact data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // اعتبارسنجی فرم سمت کلاینت
  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormStatus({ type: 'error', message: 'لطفاً نام و نام خانوادگی خود را وارد کنید' });
      return false;
    }
    if (!formData.email.trim()) {
      setFormStatus({ type: 'error', message: 'لطفاً ایمیل خود را وارد کنید' });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({ type: 'error', message: 'لطفاً یک ایمیل معتبر وارد کنید' });
      return false;
    }
    if (!formData.subject) {
      setFormStatus({ type: 'error', message: 'لطفاً موضوع پیام را انتخاب کنید' });
      return false;
    }
    if (!formData.message.trim()) {
      setFormStatus({ type: 'error', message: 'لطفاً متن پیام را وارد کنید' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // اعتبارسنجی سمت کلاینت
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setFormStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({ 
          type: 'success', 
          message: data.message || contactData?.form.successMessage || 'پیام با موفقیت ارسال شد!' 
        });
        // پاک کردن فرم
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        // اسکرول به بالای صفحه
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // بعد از 5 ثانیه پیام موفقیت را پاک کن
        setTimeout(() => {
          setFormStatus({ type: null, message: '' });
        }, 5000);
      } else {
        setFormStatus({ 
          type: 'error', 
          message: data.error || contactData?.form.errorMessage || 'خطایی رخ داد. لطفاً مجدداً تلاش کنید.' 
        });
      }
    } catch (err) {
      setFormStatus({ 
        type: 'error', 
        message: 'خطا در ارسال پیام. لطفاً اتصال اینترنت خود را بررسی کنید و مجدداً تلاش کنید.' 
      });
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // کپی کردن متن با کلیک
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setFormStatus({ type: 'success', message: `${label} با موفقیت کپی شد!` });
    setTimeout(() => {
      setFormStatus({ type: null, message: '' });
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent"></div>
          <p className="text-gray-100 mt-4">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !contactData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <ExclamationCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg mb-4">{error || 'خطا در بارگذاری صفحه تماس با ما'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="inline-block mt-4 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg transition-all duration-300"
          >
            تلاش مجدد
          </button>
          <Link href="/" className="inline-block mt-4 mx-2 text-sky-400 hover:text-sky-300">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header Spacer */}
      <div className="h-16 md:h-20"></div>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-purple-500/20"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4 animate-fade-in">
              {contactData.hero.title}
            </h1>
            <p className="text-gray-300 text-lg animate-fade-in-up">
              {contactData.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information Cards - با قابلیت کپی */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Email Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-sky-500/50 transition-all duration-300 text-center group">
              <div className="w-14 h-14 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <EnvelopeIcon className="h-7 w-7 text-sky-400" />
              </div>
              <h3 className="text-gray-100 font-semibold text-lg mb-3">ایمیل</h3>
              <div className="space-y-2">
                <p 
                  onClick={() => copyToClipboard(contactData.contactInfo.email.sales, 'ایمیل فروش')}
                  className="text-gray-400 text-sm cursor-pointer hover:text-sky-400 transition-colors"
                >
                  {contactData.contactInfo.email.sales}
                </p>
                <p 
                  onClick={() => copyToClipboard(contactData.contactInfo.email.support, 'ایمیل پشتیبانی')}
                  className="text-gray-400 text-sm cursor-pointer hover:text-sky-400 transition-colors"
                >
                  پشتیبانی: {contactData.contactInfo.email.support}
                </p>
                <p 
                  onClick={() => copyToClipboard(contactData.contactInfo.email.primary, 'ایمیل اطلاعات')}
                  className="text-gray-400 text-sm cursor-pointer hover:text-sky-400 transition-colors"
                >
                  {contactData.contactInfo.email.primary}
                </p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-sky-500/50 transition-all duration-300 text-center group">
              <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <PhoneIcon className="h-7 w-7 text-green-500" />
              </div>
              <h3 className="text-gray-100 font-semibold text-lg mb-3">تلفن</h3>
              <div className="space-y-2">
                <p 
                  onClick={() => copyToClipboard(contactData.contactInfo.phone.primary, 'شماره دفتر')}
                  className="text-gray-400 text-sm cursor-pointer hover:text-green-400 transition-colors"
                >
                  دفتر: {contactData.contactInfo.phone.primary}
                </p>
                <p 
                  onClick={() => copyToClipboard(contactData.contactInfo.phone.support, 'شماره پشتیبانی')}
                  className="text-gray-400 text-sm cursor-pointer hover:text-green-400 transition-colors"
                >
                  پشتیبانی: {contactData.contactInfo.phone.support}
                </p>
                <p 
                  onClick={() => copyToClipboard(contactData.contactInfo.phone.mobile, 'شماره همراه')}
                  className="text-gray-400 text-sm cursor-pointer hover:text-green-400 transition-colors"
                >
                  همراه: {contactData.contactInfo.phone.mobile}
                </p>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-sky-500/50 transition-all duration-300 text-center">
              <div className="w-14 h-14 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="h-7 w-7 text-orange-500" />
              </div>
              <h3 className="text-gray-100 font-semibold text-lg mb-3">آدرس</h3>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">{contactData.contactInfo.address.office}</p>
                <p className="text-gray-400 text-xs mt-2">{contactData.contactInfo.address.factory}</p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-sky-500/50 transition-all duration-300 text-center">
              <div className="w-14 h-14 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="h-7 w-7 text-sky-400" />
              </div>
              <h3 className="text-gray-100 font-semibold text-lg mb-3">ساعات کاری</h3>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">{contactData.contactInfo.workingHours.weekdays}</p>
                <p className="text-gray-400 text-sm">{contactData.contactInfo.workingHours.thursday}</p>
                <p className="text-gray-400 text-sm">{contactData.contactInfo.workingHours.friday}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="py-16 bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-3">
                {contactData.form.title}
              </h2>
              <p className="text-gray-400 mb-6">
                {contactData.form.subtitle}
              </p>

              {/* Alert Message */}
              {formStatus.type && (
                <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                  formStatus.type === 'success' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/50'
                }`}>
                  {formStatus.type === 'success' ? (
                    <CheckCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="flex-1">{formStatus.message}</p>
                  <button 
                    onClick={() => setFormStatus({ type: null, message: '' })}
                    className="flex-shrink-0 hover:opacity-70"
                  >
                    ✕
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-100 mb-2 text-sm">
                    {contactData.form.fields.name.label} {contactData.form.fields.name.required && <span className="text-sky-400">*</span>}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={contactData.form.fields.name.placeholder}
                    required={contactData.form.fields.name.required}
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-gray-100 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-gray-100 mb-2 text-sm">
                    {contactData.form.fields.email.label} {contactData.form.fields.email.required && <span className="text-sky-400">*</span>}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={contactData.form.fields.email.placeholder}
                    required={contactData.form.fields.email.required}
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-gray-100 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-gray-100 mb-2 text-sm">
                    {contactData.form.fields.phone.label}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={contactData.form.fields.phone.placeholder}
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-gray-100 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-gray-100 mb-2 text-sm">
                    {contactData.form.fields.subject.label} {contactData.form.fields.subject.required && <span className="text-sky-400">*</span>}
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required={contactData.form.fields.subject.required}
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-gray-100 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{contactData.form.fields.subject.placeholder}</option>
                    {contactData.form.fields.subject.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-100 mb-2 text-sm">
                    {contactData.form.fields.message.label} {contactData.form.fields.message.required && <span className="text-sky-400">*</span>}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={contactData.form.fields.message.placeholder}
                    required={contactData.form.fields.message.required}
                    rows={5}
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-gray-100 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-700 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      در حال ارسال...
                    </span>
                  ) : (
                    contactData.form.submitButton
                  )}
                </button>
              </form>
            </div>

            {/* Map and Social */}
            <div>
              {/* Map Placeholder */}
              <div className="bg-gray-900 rounded-xl overflow-hidden mb-6 h-64 border border-gray-700">
                <iframe
                  src={contactData.contactInfo.address.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12959.247458126543!2d51.3890!3d35.6892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e00491b1c5e1d%3A0x2f1c8e4f1e5c8e1f!2sTehran!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SilentBox Location"
                ></iframe>
              </div>

              {/* Social Media */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-gray-100 font-semibold text-lg mb-4 text-center">
                  {contactData.socialMedia.title}
                </h3>
                <div className="flex justify-center gap-4 flex-wrap">
                  <a href={contactData.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300">
                    <span className="text-white text-lg">📷</span>
                  </a>
                  <a href={contactData.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300">
                    <span className="text-white text-lg">🐦</span>
                  </a>
                  <a href={contactData.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300">
                    <span className="text-white text-lg">🔗</span>
                  </a>
                  <a href={contactData.socialMedia.telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300">
                    <span className="text-white text-lg">✈️</span>
                  </a>
                  <a href={contactData.socialMedia.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300">
                    <span className="text-white text-lg">💬</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100 text-center mb-4">
              {contactData.faq.title}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-sky-500 to-sky-600 mx-auto mb-10"></div>

            <div className="space-y-4">
              {contactData.faq.items.map((faq, index) => (
                <div key={index} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-sky-500/30 transition-all duration-300">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 text-right hover:bg-gray-900 transition-colors"
                  >
                    <span className="text-gray-100 font-medium">{faq.question}</span>
                    {openFaqIndex === index ? (
                      <ChevronUpIcon className="h-5 w-5 text-sky-400 flex-shrink-0" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-sky-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-5 pb-5 animate-fade-in">
                      <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-4">
            نیاز به کمک فوری دارید؟
          </h2>
          <p className="text-gray-400 mb-6">
            تیم پشتیبانی ما ۲۴ ساعته آماده کمک به شماست
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:items-center">
            <a
              href="https://rubika.ir/Siavashsham"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              چت در روبیکا
            </a>
            <a
              href="https://wa.me/989124541307"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              چت در واتساپ
            </a>
            <a
              href="https://t.me/+989124541307"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              چت در تلگرام
            </a>
          </div>
        </div>
      </section>

      {/* اضافه کردن انیمیشن‌های CSS */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
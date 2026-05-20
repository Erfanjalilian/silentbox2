

import React from 'react';
import Link from 'next/link';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  PhoneIcon, 
  InformationCircleIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneArrowDownLeftIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
console.log("hello")

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-gray-900 to-gray-800 border-t border-sky-500/30 mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-12">
          
          {/* Company Info Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <ShoppingBagIcon className="h-8 w-8 text-sky-400" />
              <Link href="/" className="text-2xl font-bold">
                <span className="text-gray-100">Silent</span>
                <span className="text-orange-500">Box</span>
              </Link>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              فروشگاهی مدرن برای ارائه بهترین محصولات با کیفیت و قیمت مناسب. مشتری مداری و رضایت شما اولویت ماست.
            </p>
            <div className="flex space-x-4 space-x-reverse pt-2">
              <a href="@siavashsham" className="text-gray-400 hover:text-sky-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="@siavashsham" className="text-gray-400 hover:text-sky-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" aria-label="Telegram">
 
  <path
    fill="#9AA0A6"
    d="M241.8 45.2c-1.7-7-8.7-11.2-15.7-9.1L16.6 92.6c-7.4 2.5-11 10.7-8.1 18.1 2.7 6.8 9.9 10.1 16.9 7.7l52.9-18.7 98.2 63.6-20.9 63.9c-2.4 7.4.8 15.6 7.7 18.3 7.4 2.8 15.6-1.1 18.2-8.5L241.8 45.2z"
  />
  <path
    fill="#FFFFFF"
    d="M170.6 129.2 82 99.7l117.6-45.4c4.2-1.6 7.9 2.2 6.3 6.4l-35.3 68.5c-.7 1.4-2.3 1.9-3.7 1.2z"
    opacity="0.35"
  />
</svg>

              </a>
              <a href="@siavashsham" className="text-gray-400 hover:text-sky-400 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" aria-label="WhatsApp">
  
  <path
    fill="#9AA0A6"
    d="M128 32C74.6 32 32 74.6 32 128c0 18.4 5.1 36.4 14.7 52.1L32 224l43.9-14.9
       c15.7 9.6 33.7 14.9 52.1 14.9c53.4 0 96-42.6 96-96s-42.6-96-96-96z"
  />
  
  <path
    fill="#FFFFFF"
    opacity="0.55"
    d="M162.5 140.2c-2.3-1.1-13.4-6.4-15.5-7.2-2.1-.8-3.7-1.1-5.2 1.1-1.5 2.2-6 7.2-7.4 8.7-1.4 1.5-2.7 1.7-5 0.6-2.3-1.1-10.3-3.8-19.6-12.1-7.2-6.4-12-14.2-13.4-16.6-1.4-2.4-.1-3.7 1-4.8 1-1 2.2-2.4 3.3-3.6 1.1-1.2 1.5-2.1 2.2-3.5.7-1.4.4-2.6 0-3.6-.4-1-5.2-12.5-7.1-17.1-1.9-4.6-3.8-3.9-5.2-3.9-1.3 0-2.6 0-4 0-1.4 0-3.7.5-5.6 2.7-1.9 2.2-7.2 7.1-7.2 17.4s7.4 20.2 8.4 21.6c1.0 1.4 14.2 22.9 34.4 31.2
       4.8 2 8.6 3.2 11.5 4.1 4.8 1.5 9.2 1.3 12.7.8 3.9-.6 12-5 13.6-9.8 1.6-4.8 1.6-8.9 1.1-9.8-.5-.9-1.8-1.5-4.1-2.6z"
  />
</svg>

              </a>
              <a href="@siavashsham" className="text-gray-400 hover:text-sky-400 transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.722-11.72c0-.213-.004-.425-.015-.636A10.005 10.005 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-gray-100 text-lg font-semibold border-r-2 border-sky-500 pr-3">
              دسترسی سریع
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-sky-400 transition-colors flex items-center gap-2">
                  <HomeIcon className="h-4 w-4" />
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-sky-400 transition-colors flex items-center gap-2">
                  <ShoppingBagIcon className="h-4 w-4" />
                  محصولات
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-sky-400 transition-colors flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-sky-400 transition-colors flex items-center gap-2">
                  <InformationCircleIcon className="h-4 w-4" />
                  درباره ما
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-4">
            <h3 className="text-gray-100 text-lg font-semibold border-r-2 border-sky-500 pr-3">
              اطلاعات تماس
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPinIcon className="h-5 w-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">شاداباد کوی ۱۷ شهریور خ سرحدی جنوبی کوچه چوپان پ۱۹ واحد ۷</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <PhoneArrowDownLeftIcon className="h-5 w-5 text-sky-400 flex-shrink-0" />
                <span className="text-sm">02166816283</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <EnvelopeIcon className="h-5 w-5 text-sky-400 flex-shrink-0" />
                <span className="text-sm">info@silentbox.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <ClockIcon className="h-5 w-5 text-sky-400 flex-shrink-0" />
                <span className="text-sm">شنبه تا پنجشنبه: ۹ - ۱۲ الی ۱۵ تا ۲۱</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
          
            
          </div>
        </div>
      </div>

      {/* Bottom Bar with Persian Credit Text */}
      <div className="border-t border-sky-500/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-gray-500 text-sm">
              © ۱۴۰۳ تمامی حقوق برای SilentBox محفوظ است.
            </p>
            
            {/* Centered Persian Text */}
            <p className="text-gray-400 text-sm text-center">
              طراحی شده توسط <span className="text-sky-400 hover:text-sky-300 transition-colors">عرفان جلیلیان</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <span className="text-gray-600 text-xs hover:text-sky-400 transition-colors cursor-pointer">شرایط استفاده</span>
              <span className="text-gray-600 text-xs hover:text-sky-400 transition-colors cursor-pointer">حریم خصوصی</span>
            </div>
            <a
              href="https://trustseal.enamad.ir/?id=6189749&Code=4VbFUET0EhFSIdEwORZLdDHgIpBiK5d9"
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="origin"
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/80 p-2"
            >
              <img
                src="https://trustseal.enamad.ir/logo.aspx?id=6189749&Code=4VbFUET0EhFSIdEwORZLdDHgIpBiK5d9"
                alt="نماد اعتماد الکترونیکی اینماد"
                className="h-12 w-auto"
                style={{ cursor: 'pointer' }}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
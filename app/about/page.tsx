// app/about/page.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  PhotoIcon, 
  CheckBadgeIcon, 
  TruckIcon,
  CurrencyDollarIcon,
  BoltIcon,
  DevicePhoneMobileIcon,
  SignalIcon,
  CpuChipIcon,
  AdjustmentsHorizontalIcon,
  ServerIcon,
  GlobeAltIcon,
  HomeModernIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface AboutData {
  title: string;
  description: string;
  sections: Array<{
    type: string;
    content: string;
  }>;
  features: Feature[];
  additionalFeatures: string;
  closingMessage: string;
  offerMessage: string;
  deliveryMessage: string;
  images: {
    hero: string;
    factory: string;
    product: string;
    feature: string;
  };
}

// Map icon names to components
const getIcon = (iconName: string) => {
  const icons: Record<string, any> = {
    smartphone: DevicePhoneMobileIcon,
    fan: BoltIcon,
    power: CpuChipIcon,
    speed: AdjustmentsHorizontalIcon,
    remote: GlobeAltIcon,
    meter: SignalIcon,
    voltmeter: ServerIcon,
    default: WrenchScrewdriverIcon
  };
  return icons[iconName] || icons.default;
};

async function getAboutData(): Promise<AboutData | null> {
  const { getAboutData: loadAbout } = await import('@/lib/data/about');
  return loadAbout();
}

// Hero Image Component
function HeroImage({ imageUrl, title }: { imageUrl: string; title: string }) {
  const hasImage = imageUrl && imageUrl.trim() !== '';
  
  return (
    <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
      {hasImage ? (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <PhotoIcon className="h-32 w-32 text-sky-500/30 mb-4" />
          <p className="text-gray-500">تصویر سیلنت‌باکس</p>
        </div>
      )}
    </div>
  );
}

export default async function AboutPage() {
  const aboutData = await getAboutData();
  
  if (!aboutData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">مشکلی در بارگذاری اطلاعات پیش آم است</p>
          <Link href="/" className="inline-block mt-4 text-sky-400 hover:text-sky-300">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    );
  }
  
  const heroSection = aboutData.sections.find(s => s.type === 'hero');
  const subtitleSection = aboutData.sections.find(s => s.type === 'subtitle');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header Spacer */}
      <div className="h-16 md:h-20"></div>
      
      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-6">
                {aboutData.title}
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                {heroSection?.content}
              </p>
              <p className="text-sky-400 text-lg leading-relaxed">
                {subtitleSection?.content}
              </p>
            </div>
            <HeroImage imageUrl={aboutData.images.hero} title={aboutData.title} />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              ویژگی‌های سیلنت‌باکس
            </h2>
            <div className="w-20 h-1 bg-sky-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutData.features.map((feature, index) => {
              const IconComponent = getIcon(feature.icon);
              return (
                <div
                  key={index}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-sky-500/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-sky-500/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-sky-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-gray-100 font-semibold text-lg mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Additional Features Note */}
          <div className="text-center mt-8">
            <p className="text-sky-400 text-sm">
              {aboutData.additionalFeatures}
            </p>
          </div>
        </div>
      </section>
      
      {/* Closing Message Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-sky-500/10 to-transparent rounded-2xl p-8 md:p-12 border border-sky-500/20">
              <CheckBadgeIcon className="h-16 w-16 text-sky-400 mx-auto mb-6" />
              <p className="text-gray-100 text-xl md:text-2xl leading-relaxed mb-6">
                {aboutData.closingMessage}
              </p>
              <p className="text-sky-400 text-lg font-semibold">
                {aboutData.offerMessage}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Delivery and Benefits Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Direct from Factory */}
            <div className="text-center">
              <div className="w-20 h-20 bg-sky-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HomeModernIcon className="h-10 w-10 text-sky-400" />
              </div>
              <h3 className="text-gray-100 font-semibold text-lg mb-2">
                خرید مستقیم از کارخانه
              </h3>
              <p className="text-gray-400 text-sm">
                بدون واسطه و با بهترین قیمت
              </p>
            </div>
            
            {/* Fast Delivery */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="text-gray-100 font-semibold text-lg mb-2">
                ارسال سریع
              </h3>
              <p className="text-gray-400 text-sm">
                {aboutData.deliveryMessage}
              </p>
            </div>
            
            {/* Best Price */}
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CurrencyDollarIcon className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-gray-100 font-semibold text-lg mb-2">
                بهترین قیمت
              </h3>
              <p className="text-gray-400 text-sm">
                انواع ماینرهای نو و کارکرده زیر قیمت بازار
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-100 mb-6">
              آماده خرید از سیلنت‌باکس هستید؟
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
              >
                مشاهده محصولات
              </Link>
              <Link
                href="/contact"
                className="inline-block bg-transparent border-2 border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
              >
                تماس با ما
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
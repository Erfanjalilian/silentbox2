import Image from 'next/image';

const portfolioImages = [
  {
    src: '/Images/IMG_20260508_220544_243.jpg',
    alt: 'نمونه کار شماره ۱',
    caption: 'طراحی شیک و دقیق با تمرکز بر جزئیات'
  },
  {
    src: '/Images/IMG_20260508_220544_258.jpg',
    alt: 'نمونه کار شماره ۲',
    caption: 'استفاده از نورپردازی حرفه‌ای و ترکیب رنگ‌های گرم'
  },
  {
    src: '/Images/IMG_20260508_220544_323.jpg',
    alt: 'نمونه کار شماره ۳',
    caption: 'چیدمان منظم و فضای خیره‌کننده برای ارائهٔ حرفه‌ای'
  },
  {
    src: '/Images/IMG_20260508_220544_732.jpg',
    alt: 'نمونه کار شماره ۴',
    caption: 'ترکیب بافت‌های مینیمال برای نمایش بهتر محصولات'
  },
  {
    src: '/Images/IMG_20260508_220544_872.jpg',
    alt: 'نمونه کار شماره ۵',
    caption: 'استفاده از رنگ‌های تیره و جلوه‌های شفاف'
  },
  {
    src: '/Images/-2147483648_-210543.jpg',
    alt: 'نمونه کار شماره ۷',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210548.jpg',
    alt: 'نمونه کار شماره ۸',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210550.jpg',
    alt: 'نمونه کار شماره ۹',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210555.jpg',
    alt: 'نمونه کار شماره ۱۰',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210557.jpg',
    alt: 'نمونه کار شماره ۱۱',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210560.jpg',
    alt: 'نمونه کار شماره ۱۲',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210564.jpg',
    alt: 'نمونه کار شماره ۱۳',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210570.jpg',
    alt: 'نمونه کار شماره ۱۴',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210571.jpg',
    alt: 'نمونه کار شماره ۱۵',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210576.jpg',
    alt: 'نمونه کار شماره ۱۶',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210579.jpg',
    alt: 'نمونه کار شماره ۱۷',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210580.jpg',
    alt: 'نمونه کار شماره ۱۹',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210582.jpg',
    alt: 'نمونه کار شماره ۲۰',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210584.jpg',
    alt: 'نمونه کار شماره ۲۱',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210586.jpg',
    alt: 'نمونه کار شماره ۲۲',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210590.jpg',
    alt: 'نمونه کار شماره ۲۳',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210592.jpg',
    alt: 'نمونه کار شماره ۲۴',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210597.jpg',
    alt: 'نمونه کار شماره ۲۵',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210598.jpg',
    alt: 'نمونه کار شماره ۲۶',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210600.jpg',
    alt: 'نمونه کار شماره ۲۷',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210602.jpg',
    alt: 'نمونه کار شماره ۲۸',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210604.jpg',
    alt: 'نمونه کار شماره ۲۹',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210606.jpg',
    alt: 'نمونه کار شماره ۳۰',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210608.jpg',
    alt: 'نمونه کار شماره ۳۱',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210610.jpg',
    alt: 'نمونه کار شماره ۳۲',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/IMG_20260508_220544_872',
    alt: 'نمونه کار شماره ۳۳',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210614.jpg',
    alt: 'نمونه کار شماره ۳۴',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  },
    {
    src: '/Images/-2147483648_-210618.jpg',
    alt: 'نمونه کار شماره ۳۵',
    caption: 'فضای آرام و متعادل با تاکید بر تصویر اصلی'
  }
];

function PortfolioGallery() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {portfolioImages.map((image, index) => (
        <article
          key={image.src}
          className="group overflow-hidden rounded-[28px] border border-slate-700/70 bg-slate-950/80 shadow-2xl shadow-slate-950/30 transition-transform duration-300 hover:-translate-y-1 hover:border-sky-500/40"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-900">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </div>
          <div className="space-y-2 p-5">
            <p className="text-gray-100 text-base font-semibold">{image.alt}</p>
            <p className="text-gray-400 text-sm leading-relaxed">{image.caption}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-gray-100">
      <div className="h-16 md:h-20" />
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="mb-10 rounded-[32px] border border-sky-500/20 bg-slate-950/70 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-md">
              <p className="text-sky-400 font-medium uppercase tracking-[0.3em] text-sm mb-4">
                نمونه کارها
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-100 leading-tight mb-4">
                تصاویری از پروژه‌های انجام شده در سیلنت‌باکس
              </h1>
              <p className="text-gray-400 text-base leading-relaxed sm:text-lg">
                مجموعه‌ای از نمونه‌کارها با همان زبان بصری و پالت رنگی سایت. این صفحه برای نمایش کیفیت، هماهنگی و دقت طراحی ساخته شده است.
              </p>
            </div>
          </div>

          <div className="grid gap-10">
            <div className="rounded-[32px] border border-slate-700/70 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-100">
                    گالری تصویری
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base">
                    تصاویر بهینه شده با چیدمان پاسخگو برای نمایش در تمامی دستگاه‌ها.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <PortfolioGallery />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

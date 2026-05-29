import Link from 'next/link';

export const metadata = {
  title: 'اطلاعات پرداخت',
};

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
      <div className="h-16 md:h-20"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-4xl mx-auto bg-slate-900/95 rounded-3xl p-8 border border-slate-700 shadow-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">روش‌های پرداخت</h1>
          <p className="text-slate-300 leading-7 mb-8">
            این اطلاعات پرداخت واقعی متعلق به مهدی شم آبادی است. برای واریز وجه از یکی از حساب‌های زیر استفاده کنید و رسید پرداخت را در پیام‌رسان روبیکا به شماره ۰۹۱۲۴۵۴۱۳۰۷ ارسال نمایید.
          </p>

          <div className="space-y-4 mb-6">
            <div className="rounded-3xl bg-slate-800/80 border border-slate-700 p-5">
              <div className="flex flex-col gap-3 text-slate-200">
                <div className="flex justify-between">
                  <span className="font-semibold">نام صاحب حساب</span>
                  <span>مهدی شم آبادی</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">نام بانک</span>
                  <span>بانک ملت</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">شماره حساب</span>
                  <span>6104337969670023</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">شماره شبای (IBAN)</span>
                  <span>IR69 0120 0000 0000 4648 2845 41</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-800/80 border border-slate-700 p-5">
              <div className="flex flex-col gap-3 text-slate-200">
                <div className="flex justify-between">
                  <span className="font-semibold">نام صاحب حساب</span>
                  <span>مهدی شم آبادی</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">نام بانک</span>
                  <span>بانک ملی</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">شماره حساب</span>
                  <span>6037998156483215</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">شماره شبای (IBAN)</span>
                  <span>IR11 0170 0000 0010 6998 5110 08</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-800/80 border border-slate-700 p-5">
              <div className="flex flex-col gap-3 text-slate-200">
                <div className="flex justify-between">
                  <span className="font-semibold">نام صاحب حساب</span>
                  <span>مهدی شم آبادی</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">نام بانک</span>
                  <span>بانک صادرات</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">شماره حساب</span>
                  <span>6037697513839651</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">شماره شبای (IBAN)</span>
                  <span>IR60 0190 0000 0010 3066 6050 04</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-800/80 border border-slate-700 p-5">
              <div className="flex flex-col gap-3 text-slate-200">
                <div className="flex justify-between">
                  <span className="font-semibold">نام صاحب حساب</span>
                  <span>مهدی شم آبادی</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">نام بانک</span>
                  <span>بانک تجارت</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">شماره حساب</span>
                  <span>5859831065191552</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">شماره شبای (IBAN)</span>
                  <span>IR20 0180 0000 0000 0179 0058 59</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-3xl p-5">
            <p className="text-blue-200 leading-7">
              لطفاً رسید پرداخت را از طریق پیام‌رسان روبیکا به شماره ۰۹۱۲۴۵۴۱۳۰۷ ارسال نمایید.
            </p>
          </div>

          <div className="mt-6 text-right">
            <Link href="/contact" className="text-cyan-400 hover:text-cyan-300 text-sm">
              برای پشتیبانی با ما تماس بگیرید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

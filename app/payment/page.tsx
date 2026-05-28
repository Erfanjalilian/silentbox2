import Link from 'next/link';

export const metadata = {
  title: 'Payment Information',
};

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="h-16 md:h-20"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-4">اطلاعات پرداخت</h1>
          <p className="text-gray-400 mb-6">در این صفحه شماره حساب و اطلاعات پرداخت قرار دارد. اطلاعات فعلی نمونه و نمایشی است.</p>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-200 bg-gray-900/30 p-4 rounded-lg">
              <span className="font-semibold">شماره حساب</span>
              <span>1234567890</span>
            </div>

            <div className="flex justify-between text-gray-200 bg-gray-900/30 p-4 rounded-lg">
              <span className="font-semibold">شماره شبای (IBAN)</span>
              <span>IR12 3456 7890 1234 5678 9012 34</span>
            </div>

            <div className="flex justify-between text-gray-200 bg-gray-900/30 p-4 rounded-lg">
              <span className="font-semibold">نام صاحب کارت</span>
              <span>Ali Rezaei</span>
            </div>

            <div className="flex justify-between text-gray-200 bg-gray-900/30 p-4 rounded-lg">
              <span className="font-semibold">تلفن صاحب کارت</span>
              <span>+98 912 345 6789</span>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm">Please send your payment receipt via Rubika messenger.</p>
          </div>

          <div className="mt-6 text-right">
            <Link href="/contact" className="text-sky-400 hover:text-sky-300 text-sm">تماس با ما برای پشتیبانی</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

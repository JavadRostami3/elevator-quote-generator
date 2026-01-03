import { Navigation } from '@/components/Navigation';
import { QuoteCalculator } from '@/components/QuoteCalculator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            سامانه صدور پیش‌فاکتور آسانسور
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            با این سامانه می‌توانید به راحتی پیش‌فاکتور آسانسور را محاسبه کنید.
            کافیست نوع سیستم و تعداد توقف را انتخاب کنید.
          </p>
        </div>

        {/* Calculator */}
        <QuoteCalculator />
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© ۱۴۰۳ - پیش‌فاکتور آسانسور</p>
        </div>
      </footer>
    </div>
  );
}

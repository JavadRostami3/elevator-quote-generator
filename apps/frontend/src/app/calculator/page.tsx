import { Navigation } from '@/components/Navigation';
import { QuoteCalculator } from '@/components/QuoteCalculator';

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">محاسبه‌گر پیش‌فاکتور</h1>
          <p className="text-gray-600">
            نوع سیستم و تعداد توقف را انتخاب کنید تا قیمت محاسبه شود.
          </p>
        </div>

        <QuoteCalculator />
      </main>
    </div>
  );
}

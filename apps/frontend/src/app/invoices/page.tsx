import { Navigation } from '@/components/Navigation';
import { InvoiceList } from '@/components/InvoiceList';

export default function InvoicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">لیست فاکتورها</h1>
          <p className="text-gray-600">
            فاکتورهای ذخیره شده را مشاهده، ویرایش یا حذف کنید.
          </p>
        </div>

        <InvoiceList />
      </main>
    </div>
  );
}

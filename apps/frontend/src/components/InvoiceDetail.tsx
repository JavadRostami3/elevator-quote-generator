'use client';

import { Invoice } from '@/store/slices/invoiceSlice';
import {
  formatPrice,
  formatNumber,
  formatPersianDateTime,
  getSystemTypeName,
  getStatusName,
  getStatusColor,
  cn,
} from '@/lib/utils';
import { createHugeiconComponent } from '@hugeicons/react';
import {
  Cancel01Icon,
  Download01Icon,
  PrinterIcon as PrinterSvgIcon,
} from '@hugeicons/core-free-icons';

const XMarkIcon = createHugeiconComponent('XMarkIcon', Cancel01Icon);
const PrinterIcon = createHugeiconComponent('PrinterIcon', PrinterSvgIcon);
const DocumentArrowDownIcon = createHugeiconComponent('DocumentArrowDownIcon', Download01Icon);

interface InvoiceDetailProps {
  invoice: Invoice;
  onClose: () => void;
}

export function InvoiceDetail({ invoice, onClose }: InvoiceDetailProps) {
  // چاپ فاکتور
  const handlePrint = () => {
    window.print();
  };

  // خروجی اکسل
  const handleExportExcel = () => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.XLSX) {
      // @ts-ignore
      const XLSX = window.XLSX;
      const wsData = [
        ['شماره فاکتور:', invoice.invoiceNumber],
        ['نام مشتری:', invoice.customerName || '-'],
        ['نوع سیستم:', getSystemTypeName(invoice.systemType)],
        ['تعداد توقف:', invoice.stopCount],
        ['تاریخ:', formatPersianDateTime(invoice.createdAt)],
        [],
        ['ردیف', 'نام کالا', 'واحد', 'تعداد', 'قیمت واحد (تومان)', 'قیمت کل (تومان)'],
        ...invoice.items.map((item, index) => [
          index + 1,
          item.name,
          item.unit,
          item.quantity,
          item.unitPrice,
          item.totalPrice,
        ]),
        [],
        ['', '', '', '', 'جمع کل:', invoice.grandTotal],
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'فاکتور');

      const fileName = `فاکتور_${invoice.invoiceNumber}.xlsx`;
      XLSX.writeFile(wb, fileName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl animate-slide-up print:shadow-none print:max-w-none">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b no-print">
            <h2 className="text-xl font-bold text-gray-900">
              جزئیات فاکتور {invoice.invoiceNumber}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportExcel}
                className="btn-secondary text-sm"
              >
                <DocumentArrowDownIcon className="w-4 h-4 ml-1" />
                اکسل
              </button>
              <button onClick={handlePrint} className="btn-secondary text-sm">
                <PrinterIcon className="w-4 h-4 ml-1" />
                چاپ
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* اطلاعات فاکتور */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <div>
                <span className="text-sm text-gray-500">شماره فاکتور</span>
                <p className="font-bold text-primary-600 ltr">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">نام مشتری</span>
                <p className="font-medium">{invoice.customerName || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">نوع سیستم</span>
                <p className="font-medium">{getSystemTypeName(invoice.systemType)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">تعداد توقف</span>
                <p className="font-medium">{invoice.stopCount}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">وضعیت</span>
                <p>
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      getStatusColor(invoice.status)
                    )}
                  >
                    {getStatusName(invoice.status)}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">تاریخ ایجاد</span>
                <p className="font-medium">{formatPersianDateTime(invoice.createdAt)}</p>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-500">مبلغ کل</span>
                <p className="font-bold text-xl text-primary-700">{formatPrice(invoice.grandTotal)}</p>
              </div>
            </div>

            {/* جدول اقلام */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">ردیف</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">نام کالا</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">واحد</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">تعداد</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">قیمت واحد</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">قیمت کل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoice.items.map((item, index) => (
                    <tr key={item.itemId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{item.unit}</td>
                      <td className="px-4 py-3 text-center">{formatNumber(item.quantity)}</td>
                      <td className="px-4 py-3 text-left ltr">{formatNumber(item.unitPrice)}</td>
                      <td className="px-4 py-3 text-left ltr font-semibold text-primary-600">
                        {formatNumber(item.totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-primary-50">
                  <tr>
                    <td colSpan={5} className="px-4 py-4 text-left font-bold text-lg">
                      جمع کل:
                    </td>
                    <td className="px-4 py-4 text-left ltr font-bold text-xl text-primary-700">
                      {formatPrice(invoice.grandTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

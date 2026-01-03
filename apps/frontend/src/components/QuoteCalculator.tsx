'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql-client';
import { CALCULATE_QUOTE, CREATE_INVOICE, GET_INVOICES } from '@/lib/queries';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
  setSystemType,
  setStopCount,
  setCustomerName,
  setItems,
  setCalculating,
  setError,
  resetQuote,
  QuoteItem,
} from '@/store/slices/quoteSlice';
import { addInvoice } from '@/store/slices/invoiceSlice';
import { formatPrice, formatNumber, getSystemTypeName, cn } from '@/lib/utils';
import { createHugeiconComponent } from '@hugeicons/react';
import {
  ArrowReloadVerticalIcon,
  CheckmarkCircle01Icon,
  Delete01Icon,
  Download01Icon,
} from '@hugeicons/core-free-icons';
import { useEffect, useState } from 'react';

const ArrowPathIcon = createHugeiconComponent('ArrowPathIcon', ArrowReloadVerticalIcon);
const CheckIcon = createHugeiconComponent('CheckIcon', CheckmarkCircle01Icon);
const TrashIcon = createHugeiconComponent('TrashIcon', Delete01Icon);
const DocumentArrowDownIcon = createHugeiconComponent('DocumentArrowDownIcon', Download01Icon);

interface CalculationResult {
  calculateQuote: {
    items: QuoteItem[];
    grandTotal: number;
  };
}

export function QuoteCalculator() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { systemType, stopCount, customerName, items, grandTotal, isCalculating } = useAppSelector(
    (state) => state.quote
  );
  const [showSuccess, setShowSuccess] = useState(false);

  // محاسبه قیمت
  const { refetch: calculate, isFetching } = useQuery({
    queryKey: ['calculateQuote', systemType, stopCount],
    queryFn: async () => {
      if (!systemType) return null;
      const data = await graphqlClient.request<CalculationResult>(CALCULATE_QUOTE, {
        systemType: systemType.toUpperCase(),
        stopCount,
      });
      return data;
    },
    enabled: false,
  });

  // ذخیره فاکتور
  const createInvoiceMutation = useMutation({
    mutationFn: async () => {
      const data = await graphqlClient.request(CREATE_INVOICE, {
        input: {
          customerName: customerName || 'بدون نام',
          systemType: systemType?.toUpperCase(),
          stopCount,
          items: items.map((item) => ({
            itemId: item.itemId,
            name: item.name,
            unit: item.unit,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
          grandTotal,
        },
      });
      return data;
    },
    onSuccess: (data: any) => {
      dispatch(addInvoice(data.createInvoice));
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (error: any) => {
      dispatch(setError(error.message));
    },
  });

  // اجرای محاسبه
  const handleCalculate = async () => {
    if (!systemType) {
      dispatch(setError('لطفاً نوع سیستم را انتخاب کنید'));
      return;
    }
    
    dispatch(setCalculating(true));
    dispatch(setError(null));
    
    try {
      const result = await calculate();
      if (result.data?.calculateQuote) {
        dispatch(
          setItems({
            items: result.data.calculateQuote.items,
            grandTotal: result.data.calculateQuote.grandTotal,
          })
        );
      }
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setCalculating(false));
    }
  };

  // خروجی اکسل
  const handleExportExcel = () => {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.XLSX) {
      // @ts-ignore
      const XLSX = window.XLSX;
      const wsData = [
        ['ردیف', 'نام کالا', 'واحد', 'تعداد', 'قیمت واحد (تومان)', 'قیمت کل (تومان)'],
        ...items.map((item, index) => [
          index + 1,
          item.name,
          item.unit,
          item.quantity,
          item.unitPrice,
          item.totalPrice,
        ]),
        [],
        ['', '', '', '', 'جمع کل:', grandTotal],
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'پیش‌فاکتور');
      
      const fileName = `پیش‌فاکتور_${systemType}_${stopCount}توقف.xlsx`;
      XLSX.writeFile(wb, fileName);
    }
  };

  return (
    <div className="space-y-6">
      {/* فرم انتخاب */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-6">تنظیمات پیش‌فاکتور</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* نام مشتری */}
          <div>
            <label className="label">نام مشتری (اختیاری)</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => dispatch(setCustomerName(e.target.value))}
              placeholder="نام مشتری"
              className="input"
            />
          </div>

          {/* نوع سیستم */}
          <div>
            <label className="label">نوع سیستم</label>
            <select
              value={systemType || ''}
              onChange={(e) => dispatch(setSystemType(e.target.value as 'gearless' | 'hydraulic'))}
              className="select"
            >
              <option value="">انتخاب کنید...</option>
              <option value="gearless">گیرلس</option>
              <option value="hydraulic">هیدرولیک</option>
            </select>
          </div>

          {/* تعداد توقف */}
          <div>
            <label className="label">تعداد توقف</label>
            <input
              type="number"
              min={2}
              max={20}
              value={stopCount}
              onChange={(e) => dispatch(setStopCount(parseInt(e.target.value) || 2))}
              className="input"
            />
          </div>
        </div>

        {/* دکمه محاسبه */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleCalculate}
            disabled={!systemType || isFetching || isCalculating}
            className={cn(
              'btn-primary flex-1',
              (isFetching || isCalculating) && 'opacity-70 cursor-wait'
            )}
          >
            {isFetching || isCalculating ? (
              <>
                <ArrowPathIcon className="w-5 h-5 ml-2 animate-spin" />
                در حال محاسبه...
              </>
            ) : (
              <>
                <ArrowPathIcon className="w-5 h-5 ml-2" />
                محاسبه قیمت
              </>
            )}
          </button>

          <button
            onClick={() => dispatch(resetQuote())}
            className="btn-secondary"
          >
            <TrashIcon className="w-5 h-5 ml-2" />
            پاک کردن
          </button>
        </div>
      </div>

      {/* جدول اقلام */}
      {items.length > 0 && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              لیست اقلام - {getSystemTypeName(systemType!)} {stopCount} توقف
            </h2>
            <div className="flex gap-2">
              <button onClick={handleExportExcel} className="btn-secondary text-sm">
                <DocumentArrowDownIcon className="w-4 h-4 ml-1" />
                اکسل
              </button>
            </div>
          </div>

          <div className="overflow-x-auto -mx-6">
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
                {items.map((item, index) => (
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
                    {formatPrice(grandTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ذخیره فاکتور */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => createInvoiceMutation.mutate()}
              disabled={createInvoiceMutation.isPending}
              className="btn-success"
            >
              {createInvoiceMutation.isPending ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 ml-2 animate-spin" />
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5 ml-2" />
                  ذخیره فاکتور
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* پیام موفقیت */}
      {showSuccess && (
        <div className="fixed bottom-4 left-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up">
          <CheckIcon className="w-5 h-5 inline-block ml-2" />
          فاکتور با موفقیت ذخیره شد
        </div>
      )}
    </div>
  );
}

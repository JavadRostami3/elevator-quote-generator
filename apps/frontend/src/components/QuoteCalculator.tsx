'use client';

import { useQuery } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql-client';
import { CALCULATE_QUOTE } from '@/lib/queries';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
  setSystemType,
  setStopCount,
  setCustomerName,
  setItems,
  setCalculating,
  setError,
  resetQuote,
  updateItem,
  addItem,
  removeItem,
  QuoteItem,
} from '@/store/slices/quoteSlice';
import { formatPrice, formatNumber, getSystemTypeName, cn } from '@/lib/utils';
import { createHugeiconComponent } from '@hugeicons/react';
import {
  ArrowReloadVerticalIcon,
  CheckmarkCircle01Icon,
  Delete01Icon,
  Download01Icon,
  Edit01Icon,
  Cancel01Icon,
  PrinterIcon as PrinterSvgIcon,
} from '@hugeicons/core-free-icons';
import { useRef, useState } from 'react';

const ArrowPathIcon = createHugeiconComponent('ArrowPathIcon', ArrowReloadVerticalIcon);
const CheckIcon = createHugeiconComponent('CheckIcon', CheckmarkCircle01Icon);
const TrashIcon = createHugeiconComponent('TrashIcon', Delete01Icon);
const EditIcon = createHugeiconComponent('EditIcon', Edit01Icon);
const CloseIcon = createHugeiconComponent('CloseIcon', Cancel01Icon);
const DocumentArrowDownIcon = createHugeiconComponent('DocumentArrowDownIcon', Download01Icon);
const PrinterIcon = createHugeiconComponent('PrinterIcon', PrinterSvgIcon);

interface CalculationResult {
  calculateQuote: {
    items: QuoteItem[];
    grandTotal: number;
  };
}

export function QuoteCalculator() {
  const dispatch = useAppDispatch();
  const { systemType, stopCount, customerName, items, grandTotal, isCalculating } = useAppSelector(
    (state) => state.quote
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPrintPreviewVisible, setIsPrintPreviewVisible] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState({
    name: '',
    unit: '',
    quantity: 0,
    unitPrice: 0,
  });
  const printRef = useRef<HTMLDivElement | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    unit: 'عدد',
    quantity: 1,
    unitPrice: 0,
  });

  // محاسبه پیش‌فاکتور
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

  const parseNumber = (value: string) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const waitForPrintReady = async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    if (typeof document !== 'undefined' && 'fonts' in document) {
      try {
        await (document as Document & { fonts: FontFaceSet }).fonts.ready;
      } catch {
        // Ignore font loading failures for print preparation.
      }
    }
    if (typeof window !== 'undefined') {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }
  };

  // اجرای محاسبه
  const handleCalculate = async () => {
    if (!systemType) {
      dispatch(setError('لطفاً نوع سیستم را انتخاب کنید.'));
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

      const fileName = `pre-invoice_${systemType}_${stopCount}.xlsx`;
      XLSX.writeFile(wb, fileName);
    }
  };

  const handleAddItem = () => {
    const name = newItem.name.trim();
    if (!name) {
      dispatch(setError('نام کالا را وارد کنید.'));
      return;
    }

    const unit = newItem.unit.trim() || 'عدد';
    const quantity = Number.isFinite(newItem.quantity) ? newItem.quantity : 0;
    const unitPrice = Number.isFinite(newItem.unitPrice) ? newItem.unitPrice : 0;

    dispatch(
      addItem({
        itemId: Date.now(),
        name,
        unit,
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice,
      })
    );

    setNewItem({
      name: '',
      unit: 'عدد',
      quantity: 1,
      unitPrice: 0,
    });
  };

  const openEditModal = (item: QuoteItem) => {
    setEditingItemId(item.itemId);
    setEditDraft({
      name: item.name,
      unit: item.unit,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    });
  };

  const closeEditModal = () => {
    setEditingItemId(null);
  };

  const handleSaveEdit = () => {
    if (editingItemId === null) return;
    const name = editDraft.name.trim();
    if (!name) {
      dispatch(setError('نام کالا را وارد کنید.'));
      return;
    }

    dispatch(
      updateItem({
        itemId: editingItemId,
        changes: {
          name,
          unit: editDraft.unit.trim() || 'عدد',
          quantity: Number.isFinite(editDraft.quantity) ? editDraft.quantity : 0,
          unitPrice: Number.isFinite(editDraft.unitPrice) ? editDraft.unitPrice : 0,
        },
      })
    );
    closeEditModal();
  };

  const handlePrintPreInvoice = async () => {
    if (!systemType) {
      dispatch(setError('لطفاً نوع سیستم را انتخاب کنید.'));
      return;
    }
    if (!items.length) return;

    setIsPrinting(true);
    setIsPrintPreviewVisible(true);
    dispatch(setError(null));

    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = (html2pdfModule as { default?: any }).default ?? html2pdfModule;

      await waitForPrintReady();
      const content = printRef.current;
      if (!content) {
        throw new Error('خطا در ساخت پیش‌فاکتور.');
      }

      const displayCustomer = customerName.trim() || 'بدون نام';
      await html2pdf()
        .set({
          margin: 10,
          filename: `pre-invoice_${systemType}_${stopCount}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(content)
        .save();

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      setIsPrintPreviewVisible(false);
      setIsPrinting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* فرم اطلاعات */}
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

        {/* دکمه ساخت */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
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
                در حال ساخت پیش‌فاکتور...
              </>
            ) : (
              <>
                <ArrowPathIcon className="w-5 h-5 ml-2" />
                ساخت پیش‌فاکتور
              </>
            )}
          </button>

          <button
            onClick={() => {
              dispatch(resetQuote());
              setEditingItemId(null);
            }}
            className="btn-secondary"
          >
            <TrashIcon className="w-5 h-5 ml-2" />
            پاک کردن
          </button>
        </div>
      </div>

      {/* جدول پیش‌فاکتور */}
      {items.length > 0 && (
        <div className="card overflow-hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              جزئیات پیش‌فاکتور - {getSystemTypeName(systemType!)} {stopCount} توقف
            </h2>
            <div className="flex gap-2">
              <button onClick={handleExportExcel} className="btn-secondary text-sm w-full sm:w-auto">
                <DocumentArrowDownIcon className="w-4 h-4 ml-1" />
                اکسل
              </button>
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto -mx-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">ردیف</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">نام کالا</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">واحد</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">تعداد</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">قیمت واحد</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">قیمت کل</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">عملیات</th>
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
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          aria-label="ویرایش آیتم"
                          title="ویرایش آیتم"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => dispatch(removeItem(item.itemId))}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="حذف آیتم"
                          title="حذف آیتم"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
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
                  <td className="px-4 py-4" />
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {items.map((item, index) => (
              <div key={`mobile-${item.itemId}`} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">ردیف {index + 1}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      aria-label="ویرایش آیتم"
                      title="ویرایش آیتم"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => dispatch(removeItem(item.itemId))}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="حذف آیتم"
                      title="حذف آیتم"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="font-semibold text-gray-900 mb-2">{item.name}</div>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div>
                    <div className="text-xs text-gray-500">واحد</div>
                    <div className="mt-1">{item.unit}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">تعداد</div>
                    <div className="mt-1">{formatNumber(item.quantity)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">قیمت واحد</div>
                    <div className="mt-1 ltr">{formatNumber(item.unitPrice)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">قیمت کل</div>
                    <div className="mt-1 ltr font-semibold text-primary-600">
                      {formatNumber(item.totalPrice)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* افزودن آیتم دستی */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">افزودن آیتم دستی</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              <div className="lg:col-span-2">
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="نام کالا"
                  className="input h-9"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={newItem.unit}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, unit: e.target.value }))}
                  placeholder="واحد"
                  className="input h-9 text-center"
                />
              </div>
              <div>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, quantity: parseNumber(e.target.value) }))
                  }
                  placeholder="تعداد"
                  className="input h-9 text-center"
                />
              </div>
              <div>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={newItem.unitPrice}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, unitPrice: parseNumber(e.target.value) }))
                  }
                  placeholder="قیمت واحد"
                  className="input h-9 text-left ltr"
                />
              </div>
              <div className="flex sm:col-span-2 lg:col-span-1">
                <button onClick={handleAddItem} className="btn-secondary w-full">
                  افزودن آیتم
                </button>
              </div>
            </div>
          </div>

          {/* چاپ پیش‌فاکتور */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handlePrintPreInvoice}
              disabled={isPrinting}
              className="btn-success w-full sm:w-auto"
            >
              {isPrinting ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 ml-2 animate-spin" />
                  در حال آماده‌سازی...
                </>
              ) : (
                <>
                  <PrinterIcon className="w-5 h-5 ml-2" />
                  چاپ پیش‌فاکتور
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
          پیش‌فاکتور آماده دانلود است.
        </div>
      )}

      {isPrintPreviewVisible && systemType && (
        <div className="fixed inset-0 z-40 bg-white p-6 overflow-auto">
          <div ref={printRef} className="mx-auto max-w-4xl text-sm rtl">
            <div className="text-right text-base font-bold mb-4">
              پروژه {stopCount} توقف آسانسور {getSystemTypeName(systemType)}{' '}
              {customerName.trim() || 'بدون نام'}
            </div>
            <table className="w-full text-sm border border-gray-200 border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-200 px-3 py-2 text-right">ردیف</th>
                  <th className="border border-gray-200 px-3 py-2 text-right">نام کالا</th>
                  <th className="border border-gray-200 px-3 py-2 text-center">واحد</th>
                  <th className="border border-gray-200 px-3 py-2 text-center">تعداد</th>
                  <th className="border border-gray-200 px-3 py-2 text-left ltr">قیمت واحد</th>
                  <th className="border border-gray-200 px-3 py-2 text-left ltr">قیمت کل</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={`print-${item.itemId}`}>
                    <td className="border border-gray-200 px-3 py-2 text-right">{index + 1}</td>
                    <td className="border border-gray-200 px-3 py-2 text-right">{item.name}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">{item.unit}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">
                      {formatNumber(item.quantity)}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-left ltr">
                      {formatNumber(item.unitPrice)}
                    </td>
                    <td className="border border-gray-200 px-3 py-2 text-left ltr">
                      {formatNumber(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2 text-left font-bold" colSpan={5}>
                    جمع کل:
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-left ltr font-bold">
                    {formatPrice(grandTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {editingItemId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h3 className="text-lg font-bold text-gray-900">ویرایش آیتم</h3>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="بستن"
              >
                <CloseIcon className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="label">نام کالا</label>
                <input
                  type="text"
                  value={editDraft.name}
                  onChange={(e) => setEditDraft((prev) => ({ ...prev, name: e.target.value }))}
                  className="input"
                />
              </div>
              <div>
                <label className="label">واحد</label>
                <input
                  type="text"
                  value={editDraft.unit}
                  onChange={(e) => setEditDraft((prev) => ({ ...prev, unit: e.target.value }))}
                  className="input"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">تعداد</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={editDraft.quantity}
                    onChange={(e) =>
                      setEditDraft((prev) => ({
                        ...prev,
                        quantity: parseNumber(e.target.value),
                      }))
                    }
                    className="input text-center"
                  />
                </div>
                <div>
                  <label className="label">قیمت واحد</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={editDraft.unitPrice}
                    onChange={(e) =>
                      setEditDraft((prev) => ({
                        ...prev,
                        unitPrice: parseNumber(e.target.value),
                      }))
                    }
                    className="input text-left ltr"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 px-5 py-4 border-t sm:flex-row sm:justify-end">
              <button onClick={closeEditModal} className="btn-secondary">
                انصراف
              </button>
              <button onClick={handleSaveEdit} className="btn-primary">
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

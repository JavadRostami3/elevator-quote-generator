'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_INVOICES, DELETE_INVOICE } from '@/lib/queries';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setInvoices, deleteInvoice as removeInvoice, type Invoice } from '@/store/slices/invoiceSlice';
import {
  formatPrice,
  formatPersianDate,
  getSystemTypeName,
  getStatusName,
  getStatusColor,
  cn,
} from '@/lib/utils';
import { createHugeiconComponent } from '@hugeicons/react';
import {
  ArrowReloadVerticalIcon,
  Copy01Icon,
  Delete01Icon,
  EyeIcon as EyeSvgIcon,
} from '@hugeicons/core-free-icons';
import { useState, useEffect } from 'react';
import { InvoiceDetail } from './InvoiceDetail';

const TrashIcon = createHugeiconComponent('TrashIcon', Delete01Icon);
const EyeIcon = createHugeiconComponent('EyeIcon', EyeSvgIcon);
const DocumentDuplicateIcon = createHugeiconComponent('DocumentDuplicateIcon', Copy01Icon);
const ArrowPathIcon = createHugeiconComponent('ArrowPathIcon', ArrowReloadVerticalIcon);

interface InvoicesResponse {
  invoices: Invoice[];
}

export function InvoiceList() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { invoices } = useAppSelector((state) => state.invoice);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // دریافت لیست فاکتورها
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['invoices', statusFilter],
    queryFn: async () => {
      const variables: any = { limit: 50, offset: 0 };
      if (statusFilter !== 'all') {
        variables.status = statusFilter.toUpperCase();
      }
      return graphqlClient.request<InvoicesResponse>(GET_INVOICES, variables);
    },
  });

  // حذف فاکتور
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return graphqlClient.request(DELETE_INVOICE, { id });
    },
    onSuccess: (_, id) => {
      dispatch(removeInvoice(id));
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  useEffect(() => {
    if (data?.invoices) {
      dispatch(setInvoices(data.invoices));
    }
  }, [data, dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm('آیا از حذف این فاکتور اطمینان دارید؟')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <ArrowPathIcon className="w-8 h-8 text-primary-500 animate-spin" />
          <span className="mr-3 text-gray-600">در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">لیست فاکتورها</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select w-full sm:w-40"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="draft">پیش‌نویس</option>
              <option value="finalized">نهایی شده</option>
              <option value="cancelled">لغو شده</option>
            </select>
            <button onClick={() => refetch()} className="btn-secondary w-full sm:w-auto">
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {invoices.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <DocumentDuplicateIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>هیچ فاکتوری یافت نشد</p>
          </div>
        ) : (
          <>
            <div className="md:hidden space-y-4">
              {invoices.map((invoice) => (
                <div key={`mobile-${invoice._id}`} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-primary-600 ltr">
                      {invoice.invoiceNumber}
                    </div>
                    <span
                      className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        getStatusColor(invoice.status)
                      )}
                    >
                      {getStatusName(invoice.status)}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between">
                      <span>مشتری</span>
                      <span className="font-medium text-gray-900">
                        {invoice.customerName || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>سیستم</span>
                      <span className="font-medium text-gray-900">
                        {getSystemTypeName(invoice.systemType)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>توقف</span>
                      <span className="font-medium text-gray-900">{invoice.stopCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>جمع کل</span>
                      <span className="font-semibold text-gray-900 ltr">
                        {formatPrice(invoice.grandTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>تاریخ</span>
                      <span className="font-medium text-gray-900">
                        {formatPersianDate(invoice.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="btn-secondary text-sm"
                    >
                      مشاهده
                    </button>
                    <button
                      onClick={() => handleDelete(invoice._id)}
                      disabled={deleteMutation.isPending}
                      className="btn-danger text-sm"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto -mx-6">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">شماره فاکتور</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">نام مشتری</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">نوع سیستم</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">توقف</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">مبلغ کل</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">وضعیت</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">تاریخ</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-primary-600 ltr">{invoice.invoiceNumber}</td>
                    <td className="px-4 py-3">{invoice.customerName || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      {getSystemTypeName(invoice.systemType)}
                    </td>
                    <td className="px-4 py-3 text-center">{invoice.stopCount}</td>
                    <td className="px-4 py-3 text-left ltr font-semibold">
                      {formatPrice(invoice.grandTotal)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          getStatusColor(invoice.status)
                        )}
                      >
                        {getStatusName(invoice.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500">
                      {formatPersianDate(invoice.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="مشاهده"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice._id)}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>

      {/* مودال جزئیات فاکتور */}
      {selectedInvoice && (
        <InvoiceDetail
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </>
  );
}

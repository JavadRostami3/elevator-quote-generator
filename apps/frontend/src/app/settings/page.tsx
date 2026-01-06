'use client';

import { Navigation } from '@/components/Navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlClient } from '@/lib/graphql-client';
import { GET_INVENTORY_ITEMS, UPDATE_INVENTORY_ITEM } from '@/lib/queries';
import { formatNumber, getSystemTypeName, cn } from '@/lib/utils';
import { useState } from 'react';
import { createHugeiconComponent } from '@hugeicons/react';
import { ArrowReloadVerticalIcon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

const ArrowPathIcon = createHugeiconComponent('ArrowPathIcon', ArrowReloadVerticalIcon);
const CheckIcon = createHugeiconComponent('CheckIcon', CheckmarkCircle01Icon);

interface InventoryItem {
  _id: string;
  itemId: number;
  name: string;
  unit: string;
  category: 'GEARLESS' | 'HYDRAULIC';
  calcType: 'FIXED' | 'PER_STOP' | 'RATIO';
  unitPrice: number;
  fixedQty?: number;
  ratioStops?: number;
  ratioQty?: number;
  formulaText?: string;
  isActive: boolean;
}

interface InventoryResponse {
  inventoryItems: InventoryItem[];
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editUnitPrice, setEditUnitPrice] = useState<number>(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['inventoryItems', selectedCategory],
    queryFn: async () => {
      const variables: any = {};
      if (selectedCategory !== 'all') {
        variables.category = selectedCategory.toUpperCase();
      }
      return graphqlClient.request<InventoryResponse>(GET_INVENTORY_ITEMS, variables);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ itemId, unitPrice }: { itemId: number; unitPrice: number }) => {
      return graphqlClient.request(UPDATE_INVENTORY_ITEM, {
        itemId,
        input: { unitPrice },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      setEditingItem(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    },
  });

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item.itemId);
    setEditUnitPrice(item.unitPrice);
  };

  const handleSave = (itemId: number) => {
    updateMutation.mutate({ itemId, unitPrice: editUnitPrice });
  };

  const getCalcTypeName = (calcType: string) => {
    const types: Record<string, string> = {
      FIXED: 'ثابت',
      PER_STOP: 'Q = توقف',
      RATIO: 'نسبتی',
    };
    return types[calcType] || calcType;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">تنظیمات و مدیریت اقلام</h1>
          <p className="text-gray-600">
            قیمت اقلام را ویرایش کنید یا وضعیت فعال/غیرفعال آنها را تغییر دهید.
          </p>
        </div>

        <div className="card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">لیست اقلام</h2>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select w-full sm:w-40"
            >
              <option value="all">همه</option>
              <option value="gearless">گیرلس</option>
              <option value="hydraulic">هیدرولیک</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <ArrowPathIcon className="w-8 h-8 text-primary-500 animate-spin" />
              <span className="mr-3 text-gray-600">در حال بارگذاری...</span>
            </div>
          ) : (
            <>
              <div className="md:hidden space-y-4">
                {data?.inventoryItems.map((item) => (
                  <div
                    key={`mobile-${item._id}`}
                    className={cn(
                      'rounded-xl border border-gray-200 p-4',
                      !item.isActive && 'opacity-50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">کد {item.itemId}</span>
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          item.category === 'GEARLESS'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-orange-100 text-orange-700'
                        )}
                      >
                        {getSystemTypeName(item.category.toLowerCase() as 'gearless' | 'hydraulic')}
                      </span>
                    </div>
                    <div className="mt-2 font-semibold text-gray-900">{item.name}</div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-gray-600">
                      <div>
                        <div className="text-xs text-gray-500">واحد</div>
                        <div className="mt-1">{item.unit}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">نوع محاسبه</div>
                        <div className="mt-1">{getCalcTypeName(item.calcType)}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-gray-500">قیمت</div>
                        <div className="mt-1 ltr">
                          {editingItem === item.itemId ? (
                            <input
                              type="number"
                              value={editUnitPrice}
                              onChange={(e) => setEditUnitPrice(Number(e.target.value))}
                              className="w-full input py-2 text-left ltr"
                            />
                          ) : (
                            <span className="font-semibold">{formatNumber(item.unitPrice)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2">
                      {editingItem === item.itemId ? (
                        <button
                          onClick={() => handleSave(item.itemId)}
                          disabled={updateMutation.isPending}
                          className="btn-success text-sm"
                        >
                          {updateMutation.isPending ? (
                            <ArrowPathIcon className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckIcon className="w-4 h-4" />
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(item)}
                          className="btn-secondary text-sm"
                        >
                          ویرایش
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden md:block overflow-x-auto -mx-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">شناسه</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">نام کالا</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">واحد</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">دسته‌بندی</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">نوع محاسبه</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">قیمت</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-600">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.inventoryItems.map((item) => (
                    <tr
                      key={item._id}
                      className={cn(
                        'hover:bg-gray-50 transition-colors',
                        !item.isActive && 'opacity-50'
                      )}
                    >
                      <td className="px-4 py-3 text-gray-500">{item.itemId}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{item.unit}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            item.category === 'GEARLESS'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-orange-100 text-orange-700'
                          )}
                        >
                          {getSystemTypeName(item.category.toLowerCase() as 'gearless' | 'hydraulic')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-600">
                        {getCalcTypeName(item.calcType)}
                      </td>
                      <td className="px-4 py-3 text-left ltr">
                        {editingItem === item.itemId ? (
                          <input
                            type="number"
                            value={editUnitPrice}
                            onChange={(e) => setEditUnitPrice(Number(e.target.value))}
                            className="w-32 text-left ltr input py-1"
                          />
                        ) : (
                          <span className="font-semibold">{formatNumber(item.unitPrice)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {editingItem === item.itemId ? (
                          <button
                            onClick={() => handleSave(item.itemId)}
                            disabled={updateMutation.isPending}
                            className="btn-success text-xs px-3 py-1"
                          >
                            {updateMutation.isPending ? (
                              <ArrowPathIcon className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckIcon className="w-4 h-4" />
                            )}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-primary-600 hover:underline text-sm"
                          >
                            ویرایش
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </>
          )}
        </div>

        {/* پیام موفقیت */}
        {showSuccess && (
          <div className="fixed bottom-4 left-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up">
            <CheckIcon className="w-5 h-5 inline-block ml-2" />
            قیمت با موفقیت به‌روزرسانی شد
          </div>
        )}
      </main>
    </div>
  );
}

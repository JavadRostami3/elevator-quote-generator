import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface QuoteItem {
  itemId: number;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

const calculateGrandTotal = (items: QuoteItem[]) =>
  items.reduce((sum, item) => sum + (Number.isFinite(item.totalPrice) ? item.totalPrice : 0), 0);

const calculateItemTotal = (quantity: number, unitPrice: number) => {
  const safeQuantity = Number.isFinite(quantity) ? quantity : 0;
  const safeUnitPrice = Number.isFinite(unitPrice) ? unitPrice : 0;
  return safeQuantity * safeUnitPrice;
};

interface QuoteState {
  systemType: 'gearless' | 'hydraulic' | null;
  stopCount: number;
  customerName: string;
  items: QuoteItem[];
  grandTotal: number;
  isCalculating: boolean;
  error: string | null;
}

const initialState: QuoteState = {
  systemType: null,
  stopCount: 2,
  customerName: '',
  items: [],
  grandTotal: 0,
  isCalculating: false,
  error: null,
};

const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    setSystemType: (state, action: PayloadAction<'gearless' | 'hydraulic'>) => {
      state.systemType = action.payload;
      // Reset items when system type changes
      state.items = [];
      state.grandTotal = 0;
    },
    setStopCount: (state, action: PayloadAction<number>) => {
      state.stopCount = action.payload;
    },
    setCustomerName: (state, action: PayloadAction<string>) => {
      state.customerName = action.payload;
    },
    setItems: (
      state,
      action: PayloadAction<{ items: QuoteItem[]; grandTotal: number }>
    ) => {
      state.items = action.payload.items;
      state.grandTotal = action.payload.grandTotal;
    },
    updateItem: (
      state,
      action: PayloadAction<{
        itemId: number;
        changes: Partial<Pick<QuoteItem, 'name' | 'unit' | 'quantity' | 'unitPrice'>>;
      }>
    ) => {
      const item = state.items.find((entry) => entry.itemId === action.payload.itemId);
      if (!item) return;

      if (action.payload.changes.name !== undefined) {
        item.name = action.payload.changes.name;
      }
      if (action.payload.changes.unit !== undefined) {
        item.unit = action.payload.changes.unit;
      }
      if (action.payload.changes.quantity !== undefined) {
        item.quantity = action.payload.changes.quantity;
      }
      if (action.payload.changes.unitPrice !== undefined) {
        item.unitPrice = action.payload.changes.unitPrice;
      }

      item.totalPrice = calculateItemTotal(item.quantity, item.unitPrice);
      state.grandTotal = calculateGrandTotal(state.items);
    },
    addItem: (state, action: PayloadAction<QuoteItem>) => {
      const item = action.payload;
      state.items.push({
        ...item,
        totalPrice: calculateItemTotal(item.quantity, item.unitPrice),
      });
      state.grandTotal = calculateGrandTotal(state.items);
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.itemId !== action.payload);
      state.grandTotal = calculateGrandTotal(state.items);
    },
    setCalculating: (state, action: PayloadAction<boolean>) => {
      state.isCalculating = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetQuote: () => initialState,
  },
});

export const {
  setSystemType,
  setStopCount,
  setCustomerName,
  setItems,
  updateItem,
  addItem,
  removeItem,
  setCalculating,
  setError,
  resetQuote,
} = quoteSlice.actions;

export default quoteSlice.reducer;

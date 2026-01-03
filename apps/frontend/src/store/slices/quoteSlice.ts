import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface QuoteItem {
  itemId: number;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

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
  setCalculating,
  setError,
  resetQuote,
} = quoteSlice.actions;

export default quoteSlice.reducer;

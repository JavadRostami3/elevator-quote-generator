import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  systemType: 'gearless' | 'hydraulic';
  stopCount: number;
  items: {
    itemId: number;
    name: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  grandTotal: number;
  status: 'draft' | 'finalized' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

interface InvoiceState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: InvoiceState = {
  invoices: [],
  currentInvoice: null,
  isLoading: false,
  error: null,
};

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    setInvoices: (state, action: PayloadAction<Invoice[]>) => {
      state.invoices = action.payload;
    },
    setCurrentInvoice: (state, action: PayloadAction<Invoice | null>) => {
      state.currentInvoice = action.payload;
    },
    addInvoice: (state, action: PayloadAction<Invoice>) => {
      state.invoices.unshift(action.payload);
    },
    updateInvoice: (state, action: PayloadAction<Invoice>) => {
      const index = state.invoices.findIndex((inv) => inv._id === action.payload._id);
      if (index !== -1) {
        state.invoices[index] = action.payload;
      }
      if (state.currentInvoice?._id === action.payload._id) {
        state.currentInvoice = action.payload;
      }
    },
    deleteInvoice: (state, action: PayloadAction<string>) => {
      state.invoices = state.invoices.filter((inv) => inv._id !== action.payload);
      if (state.currentInvoice?._id === action.payload) {
        state.currentInvoice = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setInvoices,
  setCurrentInvoice,
  addInvoice,
  updateInvoice,
  deleteInvoice,
  setLoading,
  setError,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;

import mongoose, { Schema, Document } from 'mongoose';

// ==========================================
// نوع محاسبه تعداد
// ==========================================
// fixed: تعداد ثابت، تغییر نمی‌کند
// per_stop: تعداد = توقف (Q = توقف)
// ratio: نسبت به توقف پایه (مثلاً "7 توقف : 1501 عدد")
// ==========================================

export type CalcType = 'fixed' | 'per_stop' | 'ratio';
export type SystemType = 'gearless' | 'hydraulic';
export type InvoiceStatus = 'draft' | 'finalized' | 'cancelled';

// ==========================================
// مدل آیتم موجودی (Inventory Item)
// ==========================================
export interface IInventoryItem extends Document {
  itemId: number;
  name: string;
  unit: string;
  category: SystemType;
  unitPrice: number;
  
  // نحوه محاسبه تعداد
  calcType: CalcType;
  
  // برای fixed: تعداد ثابت
  fixedQty?: number;
  
  // برای ratio: نسبت توقف به تعداد
  // مثلاً "7 توقف : 1501 عدد" → ratioStops=7, ratioQty=1501
  ratioStops?: number;
  ratioQty?: number;
  
  // متن اصلی فرمول (برای نمایش)
  formulaText?: string;
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryItemSchema = new Schema<IInventoryItem>(
  {
    itemId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    unit: { type: String, required: true },
    category: { 
      type: String, 
      enum: ['gearless', 'hydraulic'], 
      required: true 
    },
    unitPrice: { type: Number, required: true },
    calcType: { 
      type: String, 
      enum: ['fixed', 'per_stop', 'ratio'], 
      required: true 
    },
    fixedQty: { type: Number },
    ratioStops: { type: Number },
    ratioQty: { type: Number },
    formulaText: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ایندکس برای جستجوی سریع
InventoryItemSchema.index({ category: 1, isActive: 1 });

export const InventoryItem = mongoose.model<IInventoryItem>('InventoryItem', InventoryItemSchema);

// ==========================================
// مدل آیتم فاکتور (Invoice Item)
// ==========================================
export interface IInvoiceItem {
  itemId: number;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ==========================================
// مدل فاکتور (Invoice)
// ==========================================
export interface IInvoice extends Document {
  invoiceNumber: string;
  customerName: string;
  systemType: SystemType;
  stopCount: number;
  items: IInvoiceItem[];
  grandTotal: number;
  status: InvoiceStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    itemId: { type: Number, required: true },
    name: { type: String, required: true },
    unit: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customerName: { type: String, default: '' },
    systemType: { 
      type: String, 
      enum: ['gearless', 'hydraulic'], 
      required: true 
    },
    stopCount: { type: Number, required: true, min: 2, max: 20 },
    items: [InvoiceItemSchema],
    grandTotal: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['draft', 'finalized', 'cancelled'], 
      default: 'draft' 
    },
    notes: { type: String },
  },
  { timestamps: true }
);

// ایجاد شماره فاکتور خودکار
InvoiceSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // پیدا کردن آخرین شماره فاکتور این ماه
    const lastInvoice = await Invoice.findOne({
      invoiceNumber: new RegExp(`^INV-${year}${month}-`)
    }).sort({ invoiceNumber: -1 });
    
    let sequence = 1;
    if (lastInvoice) {
      const lastSeq = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
      sequence = lastSeq + 1;
    }
    
    this.invoiceNumber = `INV-${year}${month}-${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// ایندکس‌ها
InvoiceSchema.index({ status: 1, createdAt: -1 });
InvoiceSchema.index({ customerName: 'text' });

export const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema);

// ==========================================
// تابع کمکی محاسبه تعداد
// ==========================================
export function calculateQuantity(
  item: IInventoryItem,
  targetStops: number
): number {
  const isMeterUnit = typeof item.unit === 'string' && item.unit.includes('\u0645\u062A\u0631');
  const effectiveStops = isMeterUnit ? Math.max(targetStops - 1, 0) : targetStops;

  switch (item.calcType) {
    case 'fixed':
      // تعداد ثابت
      return item.fixedQty || 0;
      
    case 'per_stop':
      // تعداد = توقف
      return effectiveStops;
      
    case 'ratio':
      // نسبت به توقف پایه
      // فرمول: (ratioQty / ratioStops) * targetStops
      if (item.ratioStops && item.ratioQty) {
        const ratio = item.ratioQty / item.ratioStops;
        return Math.round(ratio * effectiveStops);
      }
      return 0;
      
    default:
      return 0;
  }
}


import { InventoryItem, Invoice, calculateQuantity } from '../models';

// ==========================================
// Helper Functions
// ==========================================

// Generate unique invoice number
function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}${day}-${random}`;
}

// ==========================================
// Resolvers
// ==========================================
export const resolvers = {
  Query: {
    // ----------------------------------------
    // Inventory Queries
    // ----------------------------------------
    inventoryItems: async (_: unknown, args: { category?: string; isActive?: boolean }) => {
      const filter: Record<string, unknown> = {};
      
      if (args.category) {
        filter.category = args.category.toLowerCase();
      }
      
      if (args.isActive !== undefined) {
        filter.isActive = args.isActive;
      }
      
      return await InventoryItem.find(filter).sort({ itemId: 1 });
    },

    inventoryItem: async (_: unknown, args: { itemId: number }) => {
      return await InventoryItem.findOne({ itemId: args.itemId });
    },

    // ----------------------------------------
    // Invoice Queries
    // ----------------------------------------
    invoices: async (_: unknown, args: { status?: string; limit?: number; offset?: number }) => {
      const filter: Record<string, unknown> = {};
      
      if (args.status) {
        filter.status = args.status.toLowerCase();
      }
      
      const limit = args.limit || 50;
      const offset = args.offset || 0;
      
      return await Invoice.find(filter)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
    },

    invoice: async (_: unknown, args: { id: string }) => {
      return await Invoice.findById(args.id);
    },

    invoiceByNumber: async (_: unknown, args: { invoiceNumber: string }) => {
      return await Invoice.findOne({ invoiceNumber: args.invoiceNumber });
    },

    // ----------------------------------------
    // Calculate Quote
    // ----------------------------------------
    calculateQuote: async (_: unknown, args: { systemType: string; stopCount: number }) => {
      const category = args.systemType.toLowerCase();
      const targetStops = args.stopCount;

      // Fetch all active items for the category
      const items = await InventoryItem.find({ 
        category, 
        isActive: true 
      }).sort({ itemId: 1 });

      const calculatedItems = items.map(item => {
        // Use the calculateQuantity helper from models
        const quantity = calculateQuantity(item, targetStops);
        const totalPrice = Math.round(item.unitPrice * quantity);

        return {
          itemId: item.itemId,
          name: item.name,
          unit: item.unit,
          quantity,
          unitPrice: item.unitPrice,
          totalPrice,
        };
      });

      // Calculate grand total
      const grandTotal = calculatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

      return {
        items: calculatedItems,
        grandTotal,
      };
    },
  },

  Mutation: {
    // ----------------------------------------
    // Invoice Mutations
    // ----------------------------------------
    createInvoice: async (_: unknown, args: { input: {
      customerName?: string;
      systemType: string;
      stopCount: number;
      items: Array<{
        itemId: number;
        name: string;
        unit: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }>;
      grandTotal: number;
      notes?: string;
    }}) => {
      const invoiceNumber = generateInvoiceNumber();
      
      const invoice = new Invoice({
        invoiceNumber,
        customerName: args.input.customerName || 'مشتری',
        systemType: args.input.systemType.toLowerCase(),
        stopCount: args.input.stopCount,
        items: args.input.items,
        grandTotal: args.input.grandTotal,
        status: 'draft',
        notes: args.input.notes,
      });

      return await invoice.save();
    },

    updateInvoice: async (_: unknown, args: { id: string; input: {
      customerName?: string;
      items?: Array<{
        itemId: number;
        name: string;
        unit: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }>;
      grandTotal?: number;
      status?: string;
      notes?: string;
    }}) => {
      const updateData: Record<string, unknown> = {};
      
      if (args.input.customerName) updateData.customerName = args.input.customerName;
      if (args.input.items) updateData.items = args.input.items;
      if (args.input.grandTotal !== undefined) updateData.grandTotal = args.input.grandTotal;
      if (args.input.status) updateData.status = args.input.status.toLowerCase();
      if (args.input.notes !== undefined) updateData.notes = args.input.notes;

      return await Invoice.findByIdAndUpdate(
        args.id,
        { $set: updateData },
        { new: true }
      );
    },

    deleteInvoice: async (_: unknown, args: { id: string }) => {
      const result = await Invoice.findByIdAndDelete(args.id);
      return result !== null;
    },

    // ----------------------------------------
    // Inventory Mutations
    // ----------------------------------------
    updateInventoryItem: async (_: unknown, args: { itemId: number; input: {
      unitPrice?: number;
      isActive?: boolean;
      fixedQty?: number;
      ratioStops?: number;
      ratioQty?: number;
    }}) => {
      const updateData: Record<string, unknown> = {};
      
      if (args.input.unitPrice !== undefined) updateData.unitPrice = args.input.unitPrice;
      if (args.input.isActive !== undefined) updateData.isActive = args.input.isActive;
      if (args.input.fixedQty !== undefined) updateData.fixedQty = args.input.fixedQty;
      if (args.input.ratioStops !== undefined) updateData.ratioStops = args.input.ratioStops;
      if (args.input.ratioQty !== undefined) updateData.ratioQty = args.input.ratioQty;

      return await InventoryItem.findOneAndUpdate(
        { itemId: args.itemId },
        { $set: updateData },
        { new: true }
      );
    },
  },

  // ==========================================
  // Field Resolvers
  // ==========================================
  InventoryItem: {
    category: (parent: { category: string }) => parent.category.toUpperCase(),
    calcType: (parent: { calcType: string }) => parent.calcType.toUpperCase(),
  },

  Invoice: {
    systemType: (parent: { systemType: string }) => parent.systemType.toUpperCase(),
    status: (parent: { status: string }) => parent.status.toUpperCase(),
  },
};

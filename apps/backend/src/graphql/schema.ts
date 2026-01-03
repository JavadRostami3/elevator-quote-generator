export const typeDefs = `#graphql
  # ==========================================
  # Enums
  # ==========================================
  enum SystemType {
    GEARLESS
    HYDRAULIC
  }

  enum CalcType {
    FIXED
    PER_STOP
    RATIO
  }

  enum InvoiceStatus {
    DRAFT
    FINALIZED
    CANCELLED
  }

  # ==========================================
  # Types
  # ==========================================
  type InventoryItem {
    _id: ID!
    itemId: Int!
    name: String!
    unit: String!
    category: SystemType!
    unitPrice: Float!
    calcType: CalcType!
    fixedQty: Int
    ratioStops: Int
    ratioQty: Int
    formulaText: String
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type InvoiceItem {
    itemId: Int!
    name: String!
    unit: String!
    quantity: Float!
    unitPrice: Float!
    totalPrice: Float!
  }

  type Invoice {
    _id: ID!
    invoiceNumber: String!
    customerName: String
    systemType: SystemType!
    stopCount: Int!
    items: [InvoiceItem!]!
    grandTotal: Float!
    status: InvoiceStatus!
    notes: String
    createdAt: String!
    updatedAt: String!
  }

  type CalculatedItem {
    itemId: Int!
    name: String!
    unit: String!
    quantity: Float!
    unitPrice: Float!
    totalPrice: Float!
  }

  type CalculationResult {
    items: [CalculatedItem!]!
    grandTotal: Float!
  }

  # ==========================================
  # Inputs
  # ==========================================
  input InvoiceItemInput {
    itemId: Int!
    name: String!
    unit: String!
    quantity: Float!
    unitPrice: Float!
    totalPrice: Float!
  }

  input CreateInvoiceInput {
    customerName: String
    systemType: SystemType!
    stopCount: Int!
    items: [InvoiceItemInput!]!
    grandTotal: Float!
    notes: String
  }

  input UpdateInvoiceInput {
    customerName: String
    items: [InvoiceItemInput!]
    grandTotal: Float
    status: InvoiceStatus
    notes: String
  }

  input UpdateInventoryItemInput {
    unitPrice: Float
    isActive: Boolean
    fixedQty: Int
    ratioStops: Int
    ratioQty: Int
  }

  # ==========================================
  # Queries
  # ==========================================
  type Query {
    # Inventory queries
    inventoryItems(category: SystemType, isActive: Boolean): [InventoryItem!]!
    inventoryItem(itemId: Int!): InventoryItem

    # Invoice queries
    invoices(status: InvoiceStatus, limit: Int, offset: Int): [Invoice!]!
    invoice(id: ID!): Invoice
    invoiceByNumber(invoiceNumber: String!): Invoice

    # Calculate quote
    calculateQuote(systemType: SystemType!, stopCount: Int!): CalculationResult!
  }

  # ==========================================
  # Mutations
  # ==========================================
  type Mutation {
    # Invoice mutations
    createInvoice(input: CreateInvoiceInput!): Invoice!
    updateInvoice(id: ID!, input: UpdateInvoiceInput!): Invoice!
    deleteInvoice(id: ID!): Boolean!

    # Inventory mutations
    updateInventoryItem(itemId: Int!, input: UpdateInventoryItemInput!): InventoryItem!
  }
`;

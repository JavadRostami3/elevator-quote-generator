import { gql } from 'graphql-request';

// Inventory Queries
export const GET_INVENTORY_ITEMS = gql`
  query GetInventoryItems($category: SystemType) {
    inventoryItems(category: $category) {
      _id
      itemId
      name
      unit
      category
      unitPrice
      calcType
      fixedQty
      ratioStops
      ratioQty
      formulaText
      isActive
    }
  }
`;

export const GET_INVENTORY_ITEM = gql`
  query GetInventoryItem($itemId: Int!) {
    inventoryItem(itemId: $itemId) {
      _id
      itemId
      name
      unit
      category
      unitPrice
      calcType
      fixedQty
      ratioStops
      ratioQty
      formulaText
      isActive
    }
  }
`;

// Quote Calculation
export const CALCULATE_QUOTE = gql`
  query CalculateQuote($systemType: SystemType!, $stopCount: Int!) {
    calculateQuote(systemType: $systemType, stopCount: $stopCount) {
      items {
        itemId
        name
        unit
        quantity
        unitPrice
        totalPrice
      }
      grandTotal
    }
  }
`;

// Invoice Queries
export const GET_INVOICES = gql`
  query GetInvoices($status: InvoiceStatus, $limit: Int, $offset: Int) {
    invoices(status: $status, limit: $limit, offset: $offset) {
      _id
      invoiceNumber
      customerName
      systemType
      stopCount
      grandTotal
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_INVOICE = gql`
  query GetInvoice($id: ID!) {
    invoice(id: $id) {
      _id
      invoiceNumber
      customerName
      systemType
      stopCount
      items {
        itemId
        name
        unit
        quantity
        unitPrice
        totalPrice
      }
      grandTotal
      status
      notes
      createdAt
      updatedAt
    }
  }
`;

export const GET_INVOICE_BY_NUMBER = gql`
  query GetInvoiceByNumber($invoiceNumber: String!) {
    invoiceByNumber(invoiceNumber: $invoiceNumber) {
      _id
      invoiceNumber
      customerName
      systemType
      stopCount
      items {
        itemId
        name
        unit
        quantity
        unitPrice
        totalPrice
      }
      grandTotal
      status
      notes
      createdAt
      updatedAt
    }
  }
`;

// Invoice Mutations
export const CREATE_INVOICE = gql`
  mutation CreateInvoice($input: CreateInvoiceInput!) {
    createInvoice(input: $input) {
      _id
      invoiceNumber
      customerName
      systemType
      stopCount
      items {
        itemId
        name
        unit
        quantity
        unitPrice
        totalPrice
      }
      grandTotal
      status
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_INVOICE = gql`
  mutation UpdateInvoice($id: ID!, $input: UpdateInvoiceInput!) {
    updateInvoice(id: $id, input: $input) {
      _id
      invoiceNumber
      customerName
      systemType
      stopCount
      items {
        itemId
        name
        unit
        quantity
        unitPrice
        totalPrice
      }
      grandTotal
      status
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_INVOICE = gql`
  mutation DeleteInvoice($id: ID!) {
    deleteInvoice(id: $id)
  }
`;

// Inventory Mutations
export const UPDATE_INVENTORY_ITEM = gql`
  mutation UpdateInventoryItem($itemId: Int!, $input: UpdateInventoryItemInput!) {
    updateInventoryItem(itemId: $itemId, input: $input) {
      _id
      itemId
      name
      unit
      category
      unitPrice
      calcType
      fixedQty
      ratioStops
      ratioQty
      formulaText
      isActive
    }
  }
`;

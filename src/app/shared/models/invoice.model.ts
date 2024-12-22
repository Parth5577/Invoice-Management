export interface Invoice {
  invoiceNumber?: string; // Invoice number
  invoiceDate?: Date; // Invoice date
  fromName: string; // Name of the sender
  fromAddress: string; // Address of the sender
  toName: string; // Name of the recipient
  toAddress: string; // Address of the recipient
  items: InvoiceItem[]; // List of items in the invoice
  totalAmount: number; // Total amount of the invoice
}

export interface InvoiceItem {
  id?: string;
  itemName: string; // Name of the item
  quantity: number; // Quantity of the item
  rate: number; // Rate per unit of the item
  total: number; // Total for the item (calculated as quantity * rate)
}

export interface staticAlert {
  type: 'success' | 'danger' | 'info' | 'warning';
  message: string;
}

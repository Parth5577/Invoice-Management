export interface InvoiceQueryParams {
  search?: string; // Search term for filtering invoices
  sortBy?: string; // Field to sort by (e.g., 'invoiceDate', 'invoiceNumber')
  order?: 'ASC' | 'DESC'; // Sorting order (ascending or descending)
  page?: number;
  perPage?: number;
}

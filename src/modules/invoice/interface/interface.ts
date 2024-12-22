export interface InvoiceQueryParams {
  search?: string; // search field
  sortBy?: string; // for sorting
  order?: 'ASC' | 'DESC'; // order of sorting
  page?: number; // page number
  perPage?: number;
}

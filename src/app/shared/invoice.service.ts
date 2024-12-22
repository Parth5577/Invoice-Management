import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InvoiceQueryParams } from './models/invoice-query-params';
import { Invoice, staticAlert } from './models/invoice.model';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private readonly apiUrl = `${environment.apiUrl}/invoices`;

  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getInvoices(queryParams?: InvoiceQueryParams): Observable<{
    statusCode: number;
    message: string;
    data: { list: Invoice[]; count: number };
  }> {
    let params = new HttpParams();
    if (queryParams?.search) {
      params = params.set('search', queryParams.search);
    }
    if (queryParams?.sortBy) {
      params = params.set('sortBy', queryParams.sortBy);
    }
    if (queryParams?.order) {
      params = params.set('order', queryParams.order);
    }
    if (queryParams?.page) {
      params = params.set('page', queryParams.page);
    }
    if (queryParams?.perPage) {
      params = params.set('perPage', queryParams.perPage);
    }

    return this.http.get<{
      statusCode: number;
      message: string;
      data: { list: Invoice[]; count: number };
    }>(`${this.apiUrl}/list`, { params });
  }

  showMessge(resp: staticAlert) {
    switch (resp.type) {
      case 'success':
        this.toastrService.success(resp.message, 'Success!');
        break;
      case 'warning':
        this.toastrService.warning(resp.message, 'Alert!');
        break;
      case 'danger':
        this.toastrService.error(resp.message, 'Oops!');
        break;
      default:
        this.toastrService.info(resp.message, 'Info');
        break;
    }
  }

  getInvoiceById(id: string): Observable<{
    statusCode: number;
    message: string;
    data: Invoice;
  }> {
    return this.http.get<{
      statusCode: number;
      message: string;
      data: Invoice;
    }>(`${this.apiUrl}/${id}`);
  }

  createInvoice(
    invoice: Invoice
  ): Observable<{ statusCode: number; message: string; data: Invoice }> {
    return this.http.post<{
      statusCode: number;
      message: string;
      data: Invoice;
    }>(this.apiUrl, invoice);
  }

  updateInvoice(
    id: number,
    invoice: Invoice
  ): Observable<{ statusCode: number; message: string; data: Invoice }> {
    return this.http.put<{
      statusCode: number;
      message: string;
      data: Invoice;
    }>(`${this.apiUrl}/${id}`, invoice);
  }

  deleteInvoice(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

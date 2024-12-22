import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvoiceService } from '../shared/invoice.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-invoice-list',
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatSortModule,
    MatPaginator,
  ],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css',
  providers: [InvoiceService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceListComponent implements OnInit, AfterViewInit {
  sortField: string | null = 'invoiceDate';
  sortDirection: 'ASC' | 'DESC' | null = null;
  displayedColumns: string[] = [
    'invoiceNumber',
    'fromName',
    'toName',
    'invoiceDate',
    'totalAmount',
    'view',
    'edit',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  searchQuery: string = '';
  currentPage = 1;
  pageSize = 10;
  totalRecords = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private invoiceService: InvoiceService, private router: Router) {}

  ngOnInit(): void {
    this.fetchInvoices();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchInvoices(): void {
    const { currentPage, pageSize, searchQuery } = this;
    const params = {
      sortField: this.sortField,
      sortDirection: this.sortDirection,
    };
    this.invoiceService
      .getInvoices({
        page: currentPage,
        perPage: pageSize,
        search: searchQuery,
        sortBy: this.sortField ?? '',
        order: this.sortDirection ?? 'DESC',
      })
      .subscribe({
        next: (response) => {
          if (response?.statusCode === 201) {
            this.dataSource.data = response.data.list;
            this.totalRecords = response.data.count;
          } else {
            this.invoiceService.showMessge({
              type: 'danger',
              message: response.message,
            });
          }
        },
        error: (error) => {
          this.invoiceService.showMessge({
            type: 'danger',
            message: error.message,
          });
        },
      });
  }

  applyFilter(): void {
    this.currentPage = 1;
    this.fetchInvoices();
  }

  navigateToCreate(): void {
    this.router.navigate([`/create`]);
  }

  viewInvoice(invoiceId: string): void {
    this.router.navigate([`/invoice/${invoiceId}`]);
  }

  updateInvoice(invoiceId: string): void {
    this.router.navigateByUrl(`/create?id=${invoiceId}`);
  }

  handlePageChange(event: any) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.totalRecords = event.totalRecords;
    this.fetchInvoices();
  }

  onSort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortField = field;
      this.sortDirection = 'ASC';
    }

    this.fetchInvoices();
  }
}

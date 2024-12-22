import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Invoice, InvoiceItem } from '../shared/models/invoice.model';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../shared/invoice.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-invoice-detail',
  imports: [
    MatTableModule,
    MatDividerModule,
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './invoice-detail.component.html',
  styleUrl: './invoice-detail.component.css',
})
export class InvoiceDetailComponent implements OnInit {
  invoiceId: string | null = null;
  invoice: Invoice | null = null;
  displayedColumns: string[] = ['itemName', 'quantity', 'rate', 'total'];
  dataSource: MatTableDataSource<InvoiceItem>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id') ?? null;

    if (this.invoiceId) {
      this.fetchInvoiceDetails(this.invoiceId);
    } else {
      this.router.navigate(['/']);
    }
  }

  fetchInvoiceDetails(id: string): void {
    this.invoiceService.getInvoiceById(id).subscribe({
      next: (response) => {
        if (response?.statusCode === 201) {
          this.invoice = response.data;
          this.dataSource.data = this.invoice?.items ?? [];
        } else {
          console.error('Failed to fetch invoice details:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching invoice details:', error);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}

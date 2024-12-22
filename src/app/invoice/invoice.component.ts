import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatNoDataRow,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { Invoice, InvoiceItem } from '../shared/models/invoice.model';
import { InvoiceService } from '../shared/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invoice',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
  ],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent implements OnInit {
  invoiceForm!: FormGroup;
  newItemForm!: FormGroup;
  displayedColumns: string[] = [
    'itemName',
    'quantity',
    'rate',
    'total',
    'actions',
  ];
  dataSource!: MatTableDataSource<InvoiceItem>;
  invoiceId: number = 0;
  isEdit: boolean = false;
  counter: number = 0;
  newIDs: number[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private invoiceService: InvoiceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.route.queryParams.subscribe((params) => {
      const invoiceId = params['id'];
      if (invoiceId) {
        this.invoiceId = invoiceId;
        this.loadInvoice(invoiceId);
      }
    });
  }

  initializeForms() {
    this.invoiceForm = this.fb.group({
      fromName: ['', [Validators.required, Validators.maxLength(500)]],
      fromAddress: ['', [Validators.required, Validators.maxLength(500)]],
      toName: ['', [Validators.required, Validators.maxLength(500)]],
      toAddress: ['', [Validators.required, Validators.maxLength(500)]],
      items: this.fb.array([]),
      totalAmount: [0],
    });

    this.newItemForm = this.fb.group({
      id: null,
      itemName: ['', [Validators.required, Validators.maxLength(500)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      rate: [0, [Validators.required, Validators.min(0.01)]],
    });

    this.dataSource = new MatTableDataSource<InvoiceItem>(this.items.value);
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  get formControls() {
    return this.invoiceForm.controls;
  }

  addItem(): void {
    if (this.newItemForm.invalid) {
      this.newItemForm.markAllAsTouched();
      return;
    }

    const newItem = {
      ...this.newItemForm.value,
      id: this.counter++,
      total: this.newItemForm.value.quantity * this.newItemForm.value.rate,
    };

    this.newIDs.push(newItem.id);
    this.items.push(this.fb.group(newItem));
    this.dataSource.data = this.items.value;
    this.calculateTotalAmount();
    this.newItemForm.reset();
  }

  calculateTotalAmount(): void {
    const total = this.items.value.reduce(
      (sum: number, item: InvoiceItem) => sum + item.total,
      0
    );
    this.invoiceForm.get('totalAmount')?.setValue(total);
  }

  saveInvoice(): void {
    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }

    const invoiceData = this.invoiceForm.value;
    const invoicePayload = {
      ...invoiceData,
      items: invoiceData.items.map((itm: InvoiceItem) => ({
        rate: itm.rate,
        itemName: itm.itemName,
        quantity: itm.quantity,
        total: itm.total,
      })),
    };

    const invoiceAction$ = this.invoiceId
      ? this.invoiceService.updateInvoice(this.invoiceId, invoicePayload)
      : this.invoiceService.createInvoice(invoicePayload);

    invoiceAction$.subscribe({
      next: (response) => {
        if (response.statusCode === 201) {
          this.invoiceService.showMessge({
            type: 'success',
            message: response.message,
          });
          this.router.navigate(['']);
        } else {
          this.invoiceService.showMessge({
            type: 'danger',
            message: response.message,
          });
        }
      },
      error: (err) => {
        console.error('Error saving invoice:', err);
        this.invoiceService.showMessge({
          type: 'danger',
          message: 'An error occurred while saving the invoice.',
        });
      },
    });
  }

  editItem(item: InvoiceItem): void {
    this.newItemForm.setValue({
      id: item.id ?? null,
      itemName: item.itemName,
      quantity: item.quantity,
      rate: item.rate,
    });
    this.isEdit = true;
    this.dataSource.data = this.items.value;
    this.calculateTotalAmount();
  }

  updateItem() {
    const index = this.items.controls.findIndex(
      (i) => i.value.id === this.newItemForm.value.id
    );

    if (index !== -1) {
      const newItem = {
        ...this.newItemForm.value,
        total: this.newItemForm.value.quantity * this.newItemForm.value.rate,
      };
      this.items.at(index).patchValue(newItem);
      this.dataSource.data = this.items.value;
      this.calculateTotalAmount();
      this.newItemForm.reset();
      this.isEdit = false;
    }
  }

  cancelItem() {
    this.newItemForm.reset();
    this.isEdit = false;
  }

  private loadInvoice(invoiceId: string): void {
    this.invoiceService.getInvoiceById(invoiceId).subscribe({
      next: ({
        statusCode,
        data: invoice,
        message,
      }: {
        statusCode: number;
        message: string;
        data: Invoice;
      }) => {
        if (statusCode === 201) {
          this.invoiceForm.patchValue({
            id: invoice.invoiceNumber,
            fromName: invoice.fromName,
            fromAddress: invoice.fromAddress,
            toName: invoice.toName,
            toAddress: invoice.toAddress,
            totalAmount: invoice.totalAmount,
          });

          this.items.clear();
          invoice.items.forEach((item) =>
            this.items.push(
              this.fb.group({
                id: item.id || null,
                itemName: item.itemName,
                quantity: item.quantity,
                rate: item.rate,
                total: Number(item.total),
              })
            )
          );

          this.dataSource.data = this.items.value;
          this.calculateTotalAmount();
        } else {
          this.invoiceService.showMessge({ type: 'danger', message });
        }
      },
      error: (error) => {
        console.error('Error loading invoice:', error);
        this.invoiceService.showMessge({
          type: 'danger',
          message: 'Failed to load invoice. Please try again later.',
        });
      },
    });
  }
}

import { Routes } from '@angular/router';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceDetailComponent } from './invoice-detail/invoice-detail.component';
import { InvoiceComponent } from './invoice/invoice.component';

export const routes: Routes = [
  { path: '', component: InvoiceListComponent },
  { path: 'create', component: InvoiceComponent },
  { path: 'invoice/:id', component: InvoiceDetailComponent },
];

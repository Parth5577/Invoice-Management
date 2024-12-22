import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { InvoiceItem } from './invoice-item.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('increment')
  invoiceNumber: number;

  @Column({ length: 500 })
  fromName: string;

  @Column({ length: 500 })
  fromAddress: string;

  @Column({ length: 500 })
  toName: string;

  @Column({ length: 500 })
  toAddress: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @CreateDateColumn()
  invoiceDate: Date;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  items: InvoiceItem[];
}

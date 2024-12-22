import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import {
  CreateInvoiceDto,
  InvoiceQueryParams,
  UpdateInvoiceDto,
} from './dto/invoice.dto';
import { InvoiceItem } from './entities/invoice-item.entity';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoice = this.invoiceRepository.create({
      fromName: createInvoiceDto.fromName,
      toName: createInvoiceDto.toName,
      fromAddress: createInvoiceDto.fromAddress,
      toAddress: createInvoiceDto.toAddress,
      totalAmount: createInvoiceDto.totalAmount,
      items: createInvoiceDto.items,
    });

    return this.invoiceRepository.save(invoice);
  }
  async update(
    invoiceNumber: number,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { invoiceNumber },
      relations: ['items'], // Include related items in the query
    });

    if (!invoice) {
      throw new NotFoundException(
        `Invoice with ID ${invoiceNumber} not found.`,
      );
    }

    invoice.fromName = updateInvoiceDto.fromName;
    invoice.fromAddress = updateInvoiceDto.fromAddress;
    invoice.toName = updateInvoiceDto.toName;
    invoice.toAddress = updateInvoiceDto.toAddress;
    invoice.totalAmount = updateInvoiceDto.totalAmount;

    if (updateInvoiceDto.items) {
      invoice.items = updateInvoiceDto.items.map(
        (itemDto: InvoiceItem) => itemDto,
      );
    }
    return this.invoiceRepository.save(invoice);
  }
  async findAll(queryParams: InvoiceQueryParams): Promise<[Invoice[], number]> {
    const { page, perPage, search, sortBy, order } = queryParams;
    const queryBuilder = this.invoiceRepository.createQueryBuilder('invoice');

    if (search) {
      queryBuilder.andWhere(
        '(invoice.invoiceNumber LIKE :search OR ' +
          'invoice.fromName LIKE :search OR ' +
          'invoice.fromAddress LIKE :search OR ' +
          'invoice.toName LIKE :search OR ' +
          'invoice.toAddress LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sortBy) {
      queryBuilder.orderBy(`invoice.${sortBy}`, order || 'ASC');
    }

    if (page && perPage) {
      queryBuilder.skip((page - 1) * perPage).take(perPage);
    }

    return queryBuilder
      .leftJoinAndSelect('invoice.items', 'items')
      .getManyAndCount();
  }
  async findOne(invoiceNumber: number): Promise<Invoice> {
    return this.invoiceRepository.findOne({
      where: { invoiceNumber },
      relations: ['items'],
    });
  }
}

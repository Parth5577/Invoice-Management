import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsString,
  IsOptional,
  IsNumber,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class ItemDetails {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500, { message: 'Item name must not exceed 500 characters.' })
  itemName: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1.' })
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01, { message: 'Rate must be at least 0.01.' })
  rate: number;

  @IsOptional()
  @IsNotEmpty()
  id?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Total must be at least 0.' })
  total: number;
}

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500, { message: 'From name must not exceed 500 characters.' })
  fromName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500, { message: 'From address must not exceed 500 characters.' })
  fromAddress: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500, { message: 'To name must not exceed 500 characters.' })
  toName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500, { message: 'To address must not exceed 500 characters.' })
  toAddress: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Total amount must be at least 0.' })
  totalAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemDetails)
  items: ItemDetails[];
}

export class UpdateInvoiceDto extends CreateInvoiceDto {}

export class InvoiceQueryParams {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsString({ message: 'Order of sorting (ASC or DESC)' })
  order: 'ASC' | 'DESC';

  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsNumber()
  perPage: number;
}

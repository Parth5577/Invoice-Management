import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  HttpCode,
  UseInterceptors,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import {
  CreateInvoiceDto,
  InvoiceQueryParams,
  UpdateInvoiceDto,
} from './dto/invoice.dto';
import { CommonResponseInterceptor } from 'src/filters/common-response.interceptor';
import { CommonResponse } from '../common/common-response.dto';

@Controller('api/invoices')
@UseInterceptors(CommonResponseInterceptor)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    const data = await this.invoiceService.create(createInvoiceDto);
    return new CommonResponse({
      statusCode: 201,
      message: 'Invoice created successfully.',
      data,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    const data = await this.invoiceService.update(id, updateInvoiceDto);
    return new CommonResponse({
      statusCode: 201,
      message: 'Invoice Updated successfully.',
      data,
    });
  }

  @Get('list')
  @HttpCode(201)
  async findAll(@Query() queryParams: InvoiceQueryParams) {
    const [list, count] = await this.invoiceService.findAll(queryParams);
    return new CommonResponse({
      statusCode: 201,
      message: 'Invoice retrived successfully.',
      data: { list, count },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.invoiceService.findOne(id);

    if (!data) {
      throw new NotFoundException('Data not found!');
    }

    return new CommonResponse({
      statusCode: 201,
      message: 'Invoice deleted successfully.',
      data,
    });
  }
}

import { ApiProperty } from '@nestjs/swagger';

export class CommonResponse<T> {
  @ApiProperty({ description: 'Status code of the response' })
  statusCode: number;

  @ApiProperty({ description: 'Message describing the result' })
  message: string;

  @ApiProperty({ description: 'Response data' })
  data?: T;

  constructor(partial: Partial<CommonResponse<T>>) {
    Object.assign(this, partial);
  }
}

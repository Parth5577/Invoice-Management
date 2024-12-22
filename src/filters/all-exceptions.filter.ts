import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message;
    if (exception instanceof HttpException) {
      const responseBody = exception.getResponse() as Record<string, any>;
      message = {
        message: responseBody.message || 'An error occurred',
        error: responseBody.error || 'Internal server error',
        statusCode: status,
      };
    } else {
      message = {
        message: 'Internal server error',
        error: exception,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }

    response.status(status).json({
      statusCode: status,
      message: message.message,
      error: message.error,
    });
  }
}

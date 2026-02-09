import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import { HttpStatusCode } from 'axios'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  constructor(private configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatusCode.InternalServerError

    const isFromValidation = exception.stack?.includes(
      'ValidationPipe.exceptionFactory',
    )
    const isProduction = this.configService.get('NODE_ENV') === 'production'

    const res: any = {
      status: false,
      statusCode: status,
      message: isFromValidation
        ? (exception.getResponse() as any).message
        : exception.message,
      timestamp: new Date().toISOString(),
    }

    if (!isProduction) {
      res.stackTrace = exception.stack
    }

    this.logger.error(
      `Exception name: ${exception.name}, message: ${exception.message}, status: ${status}`,
    )

    response.status(status).json(res)
  }
}

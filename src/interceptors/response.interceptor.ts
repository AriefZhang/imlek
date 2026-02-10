import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { map, catchError, switchMap } from 'rxjs/operators'
import { Response } from 'express'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor() {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => {
        return this.responseHandler(res, context)
      }),
    )
  }

  private responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp()
    const response = ctx.getResponse<Response>()
    const statusCode = res?.statusCode || response.statusCode

    const sanitizedData = this.sanitizeData(res)

    return {
      status: true,
      statusCode,
      data: sanitizedData,
      timestamp: new Date().toISOString(),
    }
  }

  private sanitizeData(data: any): any {
    if (data && typeof data === 'object') {
      return JSON.parse(JSON.stringify(data))
    }
    return data
  }
}

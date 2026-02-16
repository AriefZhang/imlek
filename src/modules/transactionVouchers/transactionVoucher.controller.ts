import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards';
import { TransactionVoucherService } from './transactionVoucher.service';

@Controller('transaction-vouchers')
export class TransactionVoucherController {
  constructor(private itemService: TransactionVoucherService) {}

  @Get('summary')
  @UseGuards(JwtAuthGuard)
  async getTxVoucherSummary(@Query('stand') stand?: string): Promise<any[]> {
    return await this.itemService.getTxVoucherSummary(Number(stand));
  }
}

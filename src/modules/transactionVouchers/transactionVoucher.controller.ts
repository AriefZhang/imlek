import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards';
import { TransactionVoucherService } from './transactionVoucher.service';

@Controller('transaction-vouchers')
export class TransactionVoucherController {
  constructor(private itemService: TransactionVoucherService) {}

  @Get('summary')
  @UseGuards(JwtAuthGuard)
  async getTxVouxherSummary(): Promise<any[]> {
    return await this.itemService.getTxVouxherSummary();
  }
}

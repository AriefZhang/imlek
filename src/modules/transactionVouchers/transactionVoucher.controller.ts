import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards';
import { TransactionVoucherService } from './transactionVoucher.service';
import { QueryTxVoucherDto } from './dto/query-tx-voucher.dto';

@Controller('transaction-vouchers')
export class TransactionVoucherController {
  constructor(private itemService: TransactionVoucherService) {}

  @Get('summary')
  @UseGuards(JwtAuthGuard)
  async getTxVoucherSummary(@Query() dto: QueryTxVoucherDto): Promise<any[]> {
    return await this.itemService.getTxVoucherSummary(dto);
  }
}

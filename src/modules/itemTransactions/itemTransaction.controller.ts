import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards';
import { ItemTransactionService } from './itemTransaction.service';

import { QuerySummaryStandItemDto } from './dto';

@Controller('item-transactions')
export class ItemTransactionController {
  constructor(private itemService: ItemTransactionService) {}

  @Get('summary/stand/:id')
  @UseGuards(JwtAuthGuard)
  async getStandSummary(
    @Param('id') id: string,
    @Query() dto: QuerySummaryStandItemDto,
  ): Promise<any[]> {
    return await this.itemService.getStandSummary(Number(id), dto);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthAdminGuard, JwtAuthGuard } from '../auth/guards';
import { CreateTransactionDto, UpdateTransactionDto } from './dto';
import { TransactionService } from './transaction.service';
import { GetUser } from 'src/common/decorators';
import { User } from '../users/entities/user.entity';
import { PageOptionsDto } from 'src/app.dtos';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  findAllTransaction(@Query() pageOptionsDto: PageOptionsDto) {
    return this.transactionService.findAllTransaction(pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findTransaction(@Param('id') id: string) {
    return this.transactionService.findTransaction(Number(id));
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  create(
    @GetUser() user: User,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionService.create(user, createTransactionDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthAdminGuard)
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(Number(id), updateTransactionDto);
  }
}

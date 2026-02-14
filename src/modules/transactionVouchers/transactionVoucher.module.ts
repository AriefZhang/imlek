import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Controller
import { TransactionVoucherController } from './transactionVoucher.controller';

// Service
import { AuthService } from '../auth/auth.service';
import { TransactionVoucherService } from './transactionVoucher.service';

@Module({
  controllers: [TransactionVoucherController],
  providers: [AuthService, JwtService, TransactionVoucherService],
})
export class TransactionVoucherModule {}

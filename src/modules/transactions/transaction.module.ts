import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Controller
import { TransactionController } from './transaction.controller';

// Service
import { AuthService } from '../auth/auth.service';
import { TransactionService } from './transaction.service';

@Module({
  controllers: [TransactionController],
  providers: [AuthService, JwtService, TransactionService],
})
export class TransactionModule {}

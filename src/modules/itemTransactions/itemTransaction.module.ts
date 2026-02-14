import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Controller
import { ItemTransactionController } from './itemTransaction.controller';

// Service
import { AuthService } from '../auth/auth.service';
import { ItemTransactionService } from './itemTransaction.service';

@Module({
  controllers: [ItemTransactionController],
  providers: [AuthService, JwtService, ItemTransactionService],
})
export class ItemTransactionModule {}

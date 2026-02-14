import { Module } from '@nestjs/common';

// Modules
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { ItemModule } from './items/item.module';
import { TransactionModule } from './transactions/transaction.module';
import { ItemTransactionModule } from './itemTransactions/itemTransaction.module';
import { TransactionVoucherModule } from './transactionVouchers/transactionVoucher.module';

const importModules = [
  AuthModule,
  UserModule,
  ItemModule,
  TransactionModule,
  ItemTransactionModule,
  TransactionVoucherModule,
];

@Module({
  imports: importModules,
})
export class RootModules {}

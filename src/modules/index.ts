import { Module } from '@nestjs/common';

// Modules
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { ItemModule } from './items/item.module';
import { TransactionModule } from './transactions/transaction.module';

const importModules = [AuthModule, UserModule, ItemModule, TransactionModule];

@Module({
  imports: importModules,
})
export class RootModules {}

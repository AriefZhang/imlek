import { Module } from '@nestjs/common';

// Modules
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { ItemModule } from './items/item.module';

const importModules = [AuthModule, UserModule, ItemModule];

@Module({
  imports: importModules,
})
export class RootModules {}

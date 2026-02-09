import { Module } from '@nestjs/common';

// Modules
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';

const importModules = [AuthModule, UserModule];

@Module({
  imports: importModules,
})
export class RootModules {}

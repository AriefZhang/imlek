import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Controller
import { ItemController } from './item.controller';

// Service
import { AuthService } from '../auth/auth.service';
import { ItemService } from './item.service';

@Module({
  controllers: [ItemController],
  providers: [AuthService, JwtService, ItemService],
})
export class ItemModule {}

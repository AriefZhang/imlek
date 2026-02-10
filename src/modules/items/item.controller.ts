import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthAdminGuard, JwtAuthGuard } from '../auth/guards';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';

import { AddItemDto, UpdateItemDto } from './dto';

@Controller('items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get('stand/:id')
  @UseGuards(JwtAuthGuard)
  async getStandItems(@Param('id') id: string): Promise<Item[]> {
    return await this.itemService.getStandItems(Number(id));
  }

  @Post('add')
  @UseGuards(JwtAuthAdminGuard)
  async add(@Body() addItemDto: AddItemDto): Promise<Item> {
    return await this.itemService.add(addItemDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthAdminGuard)
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<Item> {
    return await this.itemService.update(Number(id), updateItemDto);
  }
}

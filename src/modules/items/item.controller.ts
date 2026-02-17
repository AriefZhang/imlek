import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthAdminGuard, JwtAuthGuard } from '../auth/guards';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';

import { AddItemDto, UpdateItemDto, QueryStandItemDto } from './dto';

@Controller('items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  @Get('stand/:id')
  @UseGuards(JwtAuthGuard)
  async getStandItems(
    @Param('id') id: string,
    @Query() dto: QueryStandItemDto,
  ): Promise<Item[]> {
    return await this.itemService.getStandItems(Number(id), dto);
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

  @Delete(':id')
  @UseGuards(JwtAuthAdminGuard)
  async delete(@Param('id') id: string) {
    return await this.itemService.delete(Number(id));
  }
}

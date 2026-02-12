import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { ServicesBase } from '../../common/abstracts';
import { DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { AddItemDto, UpdateItemDto } from './dto';
import { Stand } from '../stands/entities/stand.entity';
import { handleError } from 'src/common/errors';

@Injectable()
export class ItemService {
  private logger = new Logger('UserService');
  private path = '/item';
  private entityName = 'item';
  constructor(private dataSource: DataSource) {}

  getRepository() {
    return this.dataSource.getRepository(Item);
  }

  getStandRepository() {
    return this.dataSource.getRepository(Stand);
  }

  async getItemById(id: number): Promise<Item> {
    const item = await this.getRepository().findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  async getStandItems(id: number): Promise<Item[]> {
    return this.getRepository().find({
      where: { stand: { id } },
      order: { code: 'ASC', id: 'ASC' },
    });
  }

  async add(addItemDto: AddItemDto): Promise<any> {
    try {
      const stand = await this.getStandRepository().findOne({
        where: { id: addItemDto.standId },
      });

      if (!stand) {
        throw new NotFoundException('Stand not found');
      }

      return await this.getRepository().save({ ...addItemDto, stand });
    } catch (error) {
      handleError(error);
    }
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    let item = await this.getItemById(id);
    item = { ...item, ...updateItemDto };

    return await this.getRepository().save(item);
  }
}

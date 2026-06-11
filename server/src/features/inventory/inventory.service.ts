import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { InventoryItem, InventoryItemDocument } from './schemas/inventory.schema'
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto'

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(InventoryItem.name)
    private inventoryItem: Model<InventoryItemDocument>,
  ) {}

  findAll(search?: string): Promise<InventoryItemDocument[]> {
    if (search) {
      return this.inventoryItem
        .find({ name: { $regex: search, $options: 'i' } })
        .exec()
    }
    return this.inventoryItem.find().exec()
  }

  create(input: CreateInventoryItemDto): Promise<InventoryItemDocument> {
    return this.inventoryItem.create(input)
  }
}

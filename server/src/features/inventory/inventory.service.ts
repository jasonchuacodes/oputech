import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { InventoryItem, InventoryItemDocument } from './schemas/inventory.schema'
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto'
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto'

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

  update(id: string, input: UpdateInventoryItemDto): Promise<InventoryItemDocument | null> {
    const { addQuantity, ...fields } = input
    const update: Record<string, unknown> = {}
    if (Object.keys(fields).length) update.$set = fields
    if (addQuantity) update.$inc = { quantity: addQuantity }
    return this.inventoryItem.findByIdAndUpdate(id, update, { new: true }).exec()
  }

  remove(id: string): Promise<InventoryItemDocument | null> {
    return this.inventoryItem.findByIdAndDelete(id).exec()
  }
}

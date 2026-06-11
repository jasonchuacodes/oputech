import { Injectable, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Sale, SaleDocument, PaymentMode } from './schemas/sale.schema'
import {
  InventoryItem,
  InventoryItemDocument,
} from '../inventory/schemas/inventory.schema'

interface SaleItemInput {
  inventoryItemId: string
  quantity: number
}

interface CreateSaleInput {
  items: SaleItemInput[]
  paymentMode: PaymentMode
}

@Injectable()
export class PosService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    @InjectModel(InventoryItem.name)
    private inventoryItem: Model<InventoryItemDocument>
  ) {}

  async createSale(input: CreateSaleInput): Promise<SaleDocument> {
    const ids = input.items.map((i) => i.inventoryItemId)
    const inventoryItems = await this.inventoryItem
      .find({ _id: { $in: ids } })
      .exec()

    for (const { inventoryItemId, quantity } of input.items) {
      const item = inventoryItems.find(
        (i) => i._id.toString() === inventoryItemId
      )
      if (!item)
        throw new BadRequestException(`Item ${inventoryItemId} not found`)

      if (quantity > item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${item.name}": requested ${quantity}, available ${item.quantity}`
        )
      }
    }

    const saleItems = input.items.map(({ inventoryItemId, quantity }) => {
      const item = inventoryItems.find(
        (i) => i._id.toString() === inventoryItemId
      )!
      return { inventoryItemId, name: item.name, price: item.price, quantity }
    })

    const total = saleItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

    await Promise.all(
      input.items.map(({ inventoryItemId, quantity }) =>
        this.inventoryItem.findByIdAndUpdate(inventoryItemId, {
          $inc: { quantity: -quantity },
        })
      )
    )

    return this.saleModel.create({
      items: saleItems,
      paymentMode: input.paymentMode,
      total,
    })
  }
}

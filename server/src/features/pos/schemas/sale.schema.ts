import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export enum PaymentMode {
  CASH = 'CASH',
  GCASH = 'GCASH',
}

export type SaleDocument = HydratedDocument<Sale>

@Schema({ _id: false })
class SaleItem {
  @Prop({ required: true })
  inventoryItemId: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  price: number

  @Prop({ required: true })
  quantity: number
}

const SaleItemSchema = SchemaFactory.createForClass(SaleItem)

@Schema({ timestamps: true })
export class Sale {
  @Prop({ type: [SaleItemSchema], required: true })
  items: SaleItem[]

  @Prop({ required: true, enum: Object.values(PaymentMode) })
  paymentMode: PaymentMode

  @Prop({ required: true })
  total: number
}

export const SaleSchema = SchemaFactory.createForClass(Sale)

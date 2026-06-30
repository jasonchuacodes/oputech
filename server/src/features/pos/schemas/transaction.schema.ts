import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export enum PaymentType {
  CASH = 'CASH',
  GCASH = 'GCASH',
}

export type TransactionDocument = HydratedDocument<Transaction>

@Schema({ _id: false })
class TransactionItem {
  @Prop({ required: true })
  productId: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  price: number

  @Prop({ required: true })
  quantity: number
}

const TransactionItemSchema = SchemaFactory.createForClass(TransactionItem)

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: [TransactionItemSchema], required: true })
  items: TransactionItem[]

  @Prop({ required: true, enum: Object.values(PaymentType) })
  paymentType: PaymentType

  @Prop({ required: true })
  total: number

  @Prop({ required: true, default: false })
  processed: boolean
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction)

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type InventoryItemDocument = HydratedDocument<InventoryItem>

@Schema({ timestamps: true })
export class InventoryItem {
  @Prop({ required: true, trim: true })
  name: string

  @Prop({ required: true })
  quantity: number

  @Prop({ required: true })
  price: number

  @Prop()
  imageUrl?: string
}

export const InventoryItemSchema = SchemaFactory.createForClass(InventoryItem)

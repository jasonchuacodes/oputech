import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ExpenseDocument = HydratedDocument<Expense>

@Schema({ timestamps: true })
export class Expense {
  @Prop({ required: true })
  reportId: string

  @Prop({ required: true, trim: true })
  label: string

  @Prop({ required: true })
  amount: number
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense)

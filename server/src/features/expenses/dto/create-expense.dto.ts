import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateExpenseDto {
  @IsMongoId()
  reportId: string

  @IsString()
  @IsNotEmpty()
  label: string

  @IsNumber()
  amount: number
}

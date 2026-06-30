import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Report, ReportSchema } from './schemas/report.schema'
import { Transaction, TransactionSchema } from '../pos/schemas/transaction.schema'
import { UsersModule } from '../users/users.module'
import { ReportService } from './report.service'
import { ReportResolver, ProductSaleResolver } from '../../graphql/resolvers/report.resolver'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Report.name, schema: ReportSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    UsersModule,
  ],
  providers: [ReportService, ReportResolver, ProductSaleResolver],
})
export class ReportModule {}

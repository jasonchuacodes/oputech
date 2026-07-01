import { Query, Mutation, ResolveField, Resolver, Parent, Args, Context } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ReportService, AnalyticsRange } from '../../features/report/report.service'
import { UsersService } from '../../features/users/users.service'
import { JwtAuthGuard } from '../../features/auth/guards/jwt-auth.guard'
import { ReportDocument } from '../../features/report/schemas/report.schema'
import { PaymentType } from '../../features/pos/schemas/transaction.schema'

@UseGuards(JwtAuthGuard)
@Resolver('Report')
export class ReportResolver {
  constructor(
    private readonly reportService: ReportService,
    private readonly usersService: UsersService,
  ) {}

  @Query()
  reports() {
    return this.reportService.findAll()
  }

  @Query()
  analytics(@Args('range') range: AnalyticsRange) {
    return this.reportService.getAnalytics(range)
  }

  @Mutation()
  createReport(@Args('input') input: { fromDate: string; toDate: string }, @Context() context: any) {
    const userId: string = context.req.user.userId
    return this.reportService.create(input, userId)
  }

  @Mutation()
  deleteReport(@Args('id') id: string): Promise<boolean> {
    return this.reportService.delete(id)
  }

  @ResolveField('id')
  id(@Parent() report: ReportDocument): string {
    return report._id.toString()
  }

  @ResolveField('createdBy')
  createdBy(@Parent() report: ReportDocument) {
    return this.usersService.findById(report.createdBy)
  }

  @ResolveField('totalCash')
  totalCash(@Parent() report: ReportDocument): Promise<number> {
    return this.reportService.getTotalByPaymentType(report.transactionIds, PaymentType.CASH)
  }

  @ResolveField('totalGCash')
  totalGCash(@Parent() report: ReportDocument): Promise<number> {
    return this.reportService.getTotalByPaymentType(report.transactionIds, PaymentType.GCASH)
  }

  @ResolveField('totalIncome')
  async totalIncome(@Parent() report: ReportDocument): Promise<number> {
    const [cash, gcash] = await Promise.all([
      this.reportService.getTotalByPaymentType(report.transactionIds, PaymentType.CASH),
      this.reportService.getTotalByPaymentType(report.transactionIds, PaymentType.GCASH),
    ])
    return cash + gcash
  }

  @ResolveField('fromDate')
  fromDate(@Parent() report: ReportDocument): string {
    return report.fromDate.toISOString()
  }

  @ResolveField('toDate')
  toDate(@Parent() report: ReportDocument): string {
    return report.toDate.toISOString()
  }

  @ResolveField('createdAt')
  createdAt(@Parent() report: ReportDocument): string {
    return (report as any).createdAt.toISOString()
  }

  @ResolveField('updatedAt')
  updatedAt(@Parent() report: ReportDocument): string {
    return (report as any).updatedAt.toISOString()
  }
}

@Resolver('ProductSale')
export class ProductSaleResolver {
  @ResolveField('total')
  total(@Parent() ps: { quantitySold: number; pricePerUnit: number }): number {
    return ps.quantitySold * ps.pricePerUnit
  }
}

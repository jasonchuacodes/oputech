import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { MongooseModule } from '@nestjs/mongoose'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import * as path from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './features/users/users.module'
import { AuthModule } from './features/auth/auth.module'
import { InventoryModule } from './features/inventory/inventory.module'
import { PosModule } from './features/pos/pos.module'

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: [path.resolve(__dirname, './graphql/schema/*.gql')],
      playground: true,
    }),
    UsersModule,
    AuthModule,
    InventoryModule,
    PosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

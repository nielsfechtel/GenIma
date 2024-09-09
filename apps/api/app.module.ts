import { TrpcModule } from '@api/trpc/trpc.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import base from './config/base.config'
import database from './config/database.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './config/.env.local',
      isGlobal: true,
      load: [base, database],
    }),
    TrpcModule,
  ],
})
export class AppModule {}

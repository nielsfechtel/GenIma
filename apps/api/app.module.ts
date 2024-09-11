import { TrpcModule } from '@api/trpc/trpc.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './config/.env.local',
      isGlobal: true,
    }),
    TrpcModule,
  ],
})
export class AppModule {}

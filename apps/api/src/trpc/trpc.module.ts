import { TrpcRouter } from '@api/trpc/trpc.router'
import { TrpcService } from '@api/trpc/trpc.service'
import { Global, Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'

@Module({
  imports: [DiscoveryModule],
  exports: [TrpcService],
  providers: [TrpcService, TrpcRouter],
})
@Global()
export class TrpcModule {}

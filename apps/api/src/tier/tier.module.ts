import { Module } from '@nestjs/common'
import { TierService } from './tier.service'

@Module({
  providers: [TierService],
})
export class TierModule {}

import { Module } from '@nestjs/common'
import { ApiKeyService } from './api_key.service'

@Module({
  providers: [ApiKeyService],
})
export class ApiKeyModule {}

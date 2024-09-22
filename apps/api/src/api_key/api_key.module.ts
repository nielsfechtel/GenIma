import { Module } from '@nestjs/common';
import { ApiKeyService } from './api_key.service';
import { ApiKeyController } from './api_key.controller';

@Module({
  controllers: [ApiKeyController],
  providers: [ApiKeyService],
})
export class ApiKeyModule {}

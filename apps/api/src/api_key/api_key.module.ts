import { API_Key, API_KeySchema } from '@api/api_key/schemas/api_key.schema'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ApiKeyService } from './api_key.service'

@Module({
  providers: [ApiKeyService],
  imports: [
    MongooseModule.forFeature([{ name: API_Key.name, schema: API_KeySchema }]),
  ],
})
export class ApiKeyModule {}

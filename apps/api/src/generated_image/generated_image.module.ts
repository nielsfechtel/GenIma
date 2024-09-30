import { ApiKeyService } from '@api/api_key/api_key.service'
import { API_Key, API_KeySchema } from '@api/api_key/schemas/api_key.schema'
import { CloudinaryService } from '@api/cloudinary/cloudinary.service'
import { GeneratedImageTrpcRouter } from '@api/generated_image/generated_image.trpc.router'
import {
  GeneratedImage,
  GeneratedImageSchema,
} from '@api/generated_image/schemas/generated_image.schema'
import { Tier, TierSchema } from '@api/tier/schemas/tier.schema'
import { TrpcService } from '@api/trpc/trpc.service'
import { User, UserSchema } from '@api/users/schemas/user.schema'
import { UsersService } from '@api/users/users.service'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { GeneratedImageService } from './generated_image.service'

@Module({
  exports: [GeneratedImageService],
  imports: [
    MongooseModule.forFeature([
      { name: GeneratedImage.name, schema: GeneratedImageSchema },
      { name: User.name, schema: UserSchema },
      { name: Tier.name, schema: TierSchema },
      { name: API_Key.name, schema: API_KeySchema },
      { name: API_Key.name, schema: API_KeySchema },
    ]),
  ],
  providers: [
    GeneratedImageService,
    CloudinaryService,
    GeneratedImageTrpcRouter,
    TrpcService,
    ApiKeyService,
    UsersService,
  ],
})
export class GeneratedImageModule {}

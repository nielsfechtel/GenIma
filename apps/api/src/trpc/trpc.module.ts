import { ApiKeyService } from '@api/api_key/api_key.service'
import { API_Key, API_KeySchema } from '@api/api_key/schemas/api_key.schema'
import { AuthService } from '@api/auth/auth.service'
import { AuthTrpcRouter } from '@api/auth/auth.trpc.router'
import { CloudinaryService } from '@api/cloudinary/cloudinary.service'
import { GeneratedImageService } from '@api/generated_image/generated_image.service'
import { GeneratedImageTrpcRouter } from '@api/generated_image/generated_image.trpc.router'
import { Tier, TierSchema } from '@api/tier/schemas/tier.schema'
import { TierService } from '@api/tier/tier.service'
import { TrpcRouter } from '@api/trpc/trpc.router'
import { TrpcService } from '@api/trpc/trpc.service'
import { User, UserSchema } from '@api/users/schemas/user.schema'
import { UserTrpcRouter } from '@api/users/user.trpc.router'
import { UsersService } from '@api/users/users.service'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Tier.name, schema: TierSchema },
      { name: API_Key.name, schema: API_KeySchema },
    ]),
  ],
  providers: [
    TrpcService,
    TrpcRouter,
    AuthTrpcRouter,
    ApiKeyService,
    UsersService,
    UserTrpcRouter,
    AuthService,
    TierService,
    GeneratedImageTrpcRouter,
    GeneratedImageService,
    CloudinaryService,
  ],
})
export class TrpcModule {}

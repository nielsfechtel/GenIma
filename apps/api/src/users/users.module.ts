import { ApiKeyService } from '@api/api_key/api_key.service'
import { API_Key, API_KeySchema } from '@api/api_key/schemas/api_key.schema'
import { Tier, TierSchema } from '@api/tier/schemas/tier.schema'
import { User, UserSchema } from '@api/users/schemas/user.schema'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersService } from './users.service'

@Module({
  // this way "UsersService can be used in other modules that import UsersModule"
  exports: [UsersService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Tier.name, schema: TierSchema },
      { name: API_Key.name, schema: API_KeySchema },
    ]),
  ],
  providers: [ApiKeyService, UsersService],
})
export class UsersModule {}

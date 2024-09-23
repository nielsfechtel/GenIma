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
    ]),
  ],
  providers: [UsersService],
})
export class UsersModule {}

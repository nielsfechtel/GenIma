import { AuthService } from '@api/auth/auth.service'
import { AuthTrpcRouter } from '@api/auth/auth.trpc.router'
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
    ]),
  ],
  providers: [
    TrpcService,
    TrpcRouter,
    AuthTrpcRouter,
    UsersService,
    UserTrpcRouter,
    AuthService,
    TierService,
  ],
})
export class TrpcModule {}

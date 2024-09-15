import { AuthTrpcRouter } from '@api/auth/auth.trpc.router'
import { TrpcRouter } from '@api/trpc/trpc.router'
import { TrpcService } from '@api/trpc/trpc.service'
import { User, UserSchema } from '@api/users/schemas/user.schema'
import { UsersService } from '@api/users/users.service'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [TrpcService, TrpcRouter, AuthTrpcRouter, UsersService],
})
export class TrpcModule {}

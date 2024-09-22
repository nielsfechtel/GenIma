import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'

import { AuthTrpcRouter } from '@api/auth/auth.trpc.router'
import { TrpcService } from '@api/trpc/trpc.service'
import { User, UserSchema } from '@api/users/schemas/user.schema'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthTrpcRouter, AuthService, TrpcService],
  exports: [AuthService, AuthTrpcRouter],
})
export class AuthModule {}

// modules/user/user.trpc.ts
import { AuthService } from '@api/auth/auth.service'
import { SignUpSchema } from '@api/auth/schemas/signup.schema'
import { TrpcService } from '@api/trpc/trpc.service'
import { UsersService } from '@api/users/users.service'
import { Injectable } from '@nestjs/common'
import { z } from 'zod'

@Injectable()
export class AuthTrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly userService: UsersService,
    private readonly authService: AuthService
  ) {}

  authRouter = this.trpc.router({
    helloFromAuth: this.trpc.publicProcedure.query(() => 'hello from auth'),
    signUp: this.trpc.publicProcedure
      .input(z.object(SignUpSchema))
      .mutation(async ({ input }) => {
        const { firstName, lastName, password, email } = input
        this.authService.signUp({ firstName, lastName, password, email })
      }),
    login: this.trpc.publicProcedure.query(() => []),
    changePassword: this.trpc.publicProcedure.mutation(() => {
      // when logged in and old password fits, we can just change it
    }),
    resetPassword: this.trpc.publicProcedure.query(() => {
      // This is when not logged in (check for that)
      // Then, send a reset-password-email with a token.action of "RESET_PASSWORD"
    }),
    deleteAccount: this.trpc.publicProcedure.query(() => {
      // send verify-deletion-email with a token.action of "DELETE_ACCOUNT"
    }),
    verifyToken: this.trpc.publicProcedure.mutation(() => {
      // depending on token.action, this will verify the user,
      // change the password or delete the user
    }),
  })
}

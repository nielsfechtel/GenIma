// modules/user/user.trpc.ts
import { AuthService } from '@api/auth/auth.service'
import { TrpcService } from '@api/trpc/trpc.service'
import { ChangePasswordSchema } from '@api/zod_schemas/change-password.schema'
import { LoginSchema } from '@api/zod_schemas/login.schema'
import { SignUpSchema } from '@api/zod_schemas/signup.schema'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthTrpcRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly authService: AuthService
  ) {}

  authRouter = this.trpc.router({
    signUp: this.trpc.publicProcedure
      .input(SignUpSchema)
      .mutation(async ({ input }) => {
        const { firstName, lastName, password, email } = input
        return this.authService.signUp({
          firstName,
          lastName,
          password,
          email,
        })
      }),

    login: this.trpc.publicProcedure
      .input(LoginSchema)
      .query(async ({ input }) => {
        const { email, password } = input
        return this.authService.signIn(email, password)
      }),

    changePassword: this.trpc.protectedProcedure
      .input(ChangePasswordSchema)
      .mutation(async ({ ctx, input }) => {
        // when logged in and old password fits, we can just change it
        return this.authService.updatePassword(
          ctx.user.email,
          input.oldPassword,
          input.newPassword
        )
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

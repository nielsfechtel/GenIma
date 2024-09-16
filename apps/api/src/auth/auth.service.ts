import { SignUpSchema } from '@api/zod_schemas/signup.schema'
import { VerifyTokenType } from '@api/zod_schemas/verify-token.type'
import { MailerService } from '@nestjs-modules/mailer'
import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TRPCError } from '@trpc/server'
import z from 'zod'
import { UsersService } from '../users/users.service'
const bcrypt = require('bcryptjs')

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailerService,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, password: string) {
    // check if we have a user with this email
    const user = await this.usersService.findOneByEmail(email)

    // For security reasons, we do not want to indicate if the problem is any of these:
    // 1. User with that email doesn't exist
    // 2. Password is incorrect
    // Instead, we return here and down below where we check password, only this
    if (!user) {
      return new TRPCError({
        code: 'UNAUTHORIZED',
      })
    }

    if (!user.isVerified) {
      return new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Please verify your email',
      })
    }

    // check if passwords match - bcrypt the sent one and compare
    const passwordsMatch = await bcrypt.compare(password, user.password)
    if (!passwordsMatch) {
      return new TRPCError({
        code: 'UNAUTHORIZED',
      })
    }

    // The 'sub' stands for subject and is a usual claim made in JWTs:
    // https://devforum.okta.com/t/why-is-the-sub-claim-in-the-access-token-and-id-token-different/3978/3
    // not sure if we need it here, though, since the email is also globally unique and more useful than the DB-_id
    const payload = { sub: user._id, email: user.email }
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_KEY,
      }),
    }
  }

  async signUp({
    firstName,
    lastName,
    password,
    email,
  }: z.infer<typeof SignUpSchema>) {
    // hash PW and overwrite the provided plain-text one
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await this.usersService.create({
      firstName,
      lastName: lastName || '',
      email,
      password: hashedPassword,
    })

    /*
    for some reason, only in the e2e-tests, jwtService would
    complain it didn't have a key (env-file was loaded correctly, yes).
    this StackOverflow-reply helped: https://stackoverflow.com/a/74635946/5272905
    said you needed to, again, provide a secret here, even though we're already
    doing it when registering the module in AuthModule
    */
    // send email with the token
    const token = await this.jwtService.signAsync(
      {
        id: user._id,
        email: user.email,
        action: 'VERIFY_EMAIL',
      },
      { secret: process.env.JWT_KEY }
    )

    const port =
      process.env.NODE_ENV === 'production' ? '' : `:${process.env.PORT}`
    const linkWithToken = `${process.env.BASE_URL}${port}/auth/verify/${token}`

    this.mailService.sendMail({
      to: user.email,
      subject: `Verify your email for Niels' Graduation Project`,
      template: 'verifyEmail',
      context: {
        linkWithToken,
      },
    })

    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName || undefined,
    }
  }

  async verifyEmail() {
    const token: VerifyTokenType = { action: 'VERIFY_EMAIL' } //this.jwtService.verify(payload.token)

    if (!token || token.action !== 'VERIFY_EMAIL') {
      return new BadRequestException('Invalid token!')
    }

    // const user = this.usersService.update(token.id, {
    //   isVerified: true,
    // })

    // return user
  }

  async updatePassword(
    email: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await this.usersService.findOneByEmail(email)
    if (!user) {
      return new TRPCError({
        code: 'BAD_REQUEST',
      })
    }

    const passwordsMatch = await bcrypt.compare(oldPassword, user.password)
    if (!passwordsMatch) {
      return new TRPCError({
        code: 'UNAUTHORIZED',
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    this.usersService.update(user._id.toString(), { password: hashedPassword })
  }
}

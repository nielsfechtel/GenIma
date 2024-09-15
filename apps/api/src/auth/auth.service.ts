import { SignUpSchema } from '@api/zod_schemas/signup.schema'
import { VerifyTokenType } from '@api/zod_schemas/verify-token.type'
import { MailerService } from '@nestjs-modules/mailer'
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
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
      return new UnauthorizedException()
    }

    if (!user.isVerified) {
      return new BadRequestException('Please verify your account')
    }

    // check if passwords match - bcrypt the sent one and compare
    const passwordsMatch = await bcrypt.compare(password, user.password)
    if (!passwordsMatch) {
      return new UnauthorizedException()
    }

    // The 'sub' stands for subject and is a usual claim made in JWTs:
    // https://devforum.okta.com/t/why-is-the-sub-claim-in-the-access-token-and-id-token-different/3978/3
    // not sure if we need it here, though, since the email is also globally unique and more useful than the DB-_id
    const payload = { sub: user._id, email: user.email }
    return {
      access_token: await this.jwtService.signAsync(payload),
    }
  }

  async signUp({
    firstName,
    lastName,
    password,
    email,
  }: z.infer<typeof SignUpSchema>) {
    // hash PW and overwrite the provided plain-text one
    const hashedPassword = bcrypt.hash(password, 10)

    const user = await this.usersService.create()
    // {
    //       firstName,
    //       lastName: lastName || '',
    //       email,
    //       password: hashedPassword,
    //     }

    // send email with the token
    const token = await this.jwtService.signAsync({
      id: user._id,
      email: user.email,
      action: 'VERIFY_EMAIL',
    })

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

    return user
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

  async updatePassword() {}
}

import { SignUpWithGoogleSchema } from '@api/zod_schemas/loginWithGoogle.schema'
import { SignUpSchema } from '@api/zod_schemas/signup.schema'
import { VerifyTokenSchema } from '@api/zod_schemas/verifyToken.schema'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TRPCError } from '@trpc/server'
import { OAuth2Client } from 'google-auth-library'
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
    console.log('in signin here')

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_KEY,
      }),
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    }
  }

  async loginWithGoogle({
    firstName,
    lastName,
    password,
    email,
    isVerifiedEmail,
    googleIDtoken,
  }: z.infer<typeof SignUpWithGoogleSchema>) {
    // check with google if this is a valid token
    /*
Do I have an ID token or access-token?
Also these are JWTs, no? Then I should be able to use Google's public key to check it
here without calling the server, as this is not intended

// If the user grants at least one permission, the Google Authorization Server sends your application an access token (or an authorization code that your application can
use to obtain an access token) and a list of scopes of access granted by that token.
PUT THIS INTO OBSIDIAN
I think I want to verify the ID_TOKEN (as seen below), not the Access_token. I should
get an ID-token too.
Check these links for more info then:
https://developers.google.com/identity/sign-in/web/backend-auth#using-a-google-api-client-library
https://stackoverflow.com/a/64398497/5272905
https://cloud.google.com/nodejs/docs/reference/google-auth-library/latest
    */
    const client = new OAuth2Client()
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      })
      const payload = ticket.getPayload()
      const userid = payload['sub']
      // If the request specified a Google Workspace domain:
      // const domain = payload['hd'];
    }
    verify().catch(console.error)

    // next, does this user exist in our DB?
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
    // if not, sign them up

    // then return ok
    const payload = { sub: user._id, email: user.email }

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_KEY,
      }),
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
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

  async verifyToken(token: string) {
    const tokenValues: z.infer<typeof VerifyTokenSchema> =
      this.jwtService.decode(token)

    switch (tokenValues.action) {
      case 'DELETE_ACCOUNT': {
        return this.usersService.deleteOneByEmail(tokenValues.email)
      }
      case 'RESET_PASSWORD': {
        return
      }
      case 'VERIFY_EMAIL': {
        return this.usersService.update(tokenValues.id, {
          isVerified: true,
        })
      }
      default: {
        return new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid token' })
      }
    }
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

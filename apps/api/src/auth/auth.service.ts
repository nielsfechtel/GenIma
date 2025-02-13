import { SignUpSchema } from '@api/schemas/signup.schema'
import { UserReturnSchema } from '@api/schemas/user-return.schema'

import { VerifyTokenSchema } from '@api/schemas/verifyToken.schema'
import { TierSchema } from '@api/tier/schemas/tier.schema'
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { TRPCError } from '@trpc/server'
import { OAuth2Client } from 'google-auth-library'
import { InferSchemaType } from 'mongoose'
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
    const user = await this.usersService.findOneByEmail(email)

    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Check email or password.',
      })
    }

    if (!user.isVerified) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Please verify your email.',
      })
    }

    if (!user.password) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No password set, sign in with Google.',
      })
    }

    // check if passwords match - bcrypt the sent one and compare
    const passwordsMatch = await bcrypt.compare(password, user.password)
    if (!passwordsMatch) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Check email or password.',
      })
    }

    // The 'sub' stands for subject and is a usual claim made in JWTs:
    // https://devforum.okta.com/t/why-is-the-sub-claim-in-the-access-token-and-id-token-different/3978/3
    // not sure if we need it here, though, since the email is also globally unique and more useful than the DB-_id
    const payload = { sub: user._id, email: user.email }

    // So this comment https://stackoverflow.com/a/78017052/5272905 and others
    // said that apparently TypeScript doesn't properly understand that the 'tier'-field is no longer an
    // ObjectId, but populated now (as done in usersService.findOneByEmail).
    // That's why we force the type here
    const tier = user.tier as unknown as InferSchemaType<typeof TierSchema>

    const data: UserReturnSchema = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tier: {
        name: tier.name,
        tokenLimit: tier.tokenLimit,
        createdAt: tier.createdAt,
        updatedAt: tier.updatedAt,
      },
      api_keys: user.api_keys,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      images: user.images,
    }

    return {
      accessToken: await this.jwtService.signAsync(payload),
      data,
    }
  }

  async signinWithGoogle(googleIDtoken: string) {
    const client = new OAuth2Client()
    const ticket = await client.verifyIdToken({
      idToken: googleIDtoken,
      audience: process.env.AUTH_GOOGLE_ID,
    })

    const IDpayload = ticket.getPayload()

    const userValues = {
      email: IDpayload!.email!,
      firstName: IDpayload!.given_name,
      lastName: IDpayload!.family_name,
    }
    let userFound = await this.usersService.findOneByEmail(userValues.email)

    if (!userFound) {
      // since Google already vetted this user, we can create it and also set it as verified

      userFound = await this.usersService.create(userValues)

      await this.usersService.update(userFound._id.toString(), {
        isVerified: true,
      })
    }

    // then return ok
    const payload = { sub: userFound._id, email: userFound.email }

    const tier = userFound.tier as unknown as InferSchemaType<typeof TierSchema>

    const data: UserReturnSchema = {
      _id: userFound._id,
      email: userFound.email,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      role: userFound.role,
      tier: {
        name: tier.name,
        tokenLimit: tier.tokenLimit,
        createdAt: tier.createdAt,
        updatedAt: tier.updatedAt,
      },
      api_keys: userFound.api_keys,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
      images: userFound.images,
    }

    return {
      accessToken: await this.jwtService.signAsync(payload),
      data,
    }
  }

  async signUp({
    firstName,
    lastName,
    password,
    email,
  }: z.infer<typeof SignUpSchema>) {
    const doesUserExist = await this.usersService.findOneByEmail(email)

    if (doesUserExist) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'A user with this email already exists',
      })
    }

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
    const payload: z.infer<typeof VerifyTokenSchema> = {
      email: user.email,
      action: 'VERIFY_EMAIL',
    }
    const token = await this.jwtService.signAsync(payload)

    const linkWithToken = `${process.env.WEB_BASE_URL}/auth/verify?token=${token}`

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

  async executeToken(token: string) {
    const tokenValues: z.infer<typeof VerifyTokenSchema> =
      await this.jwtService.decode(token)
    if (!tokenValues)
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid token' })

    switch (tokenValues.action) {
      case 'DELETE_ACCOUNT': {
        await this.usersService.deleteOneByEmail(tokenValues.email)
        return {
          success: true,
          message: 'User successfully deleted',
          actionType: 'DELETE_ACCOUNT',
        }
      }
      case 'RESET_PASSWORD': {
        return {
          success: false,
          message: 'NOT YET IMPLEMENTED',
          actionType: 'RESET_PASSWORD',
        }
      }
      case 'VERIFY_EMAIL': {
        const user = await this.usersService.findOneByEmail(tokenValues.email)
        if (!user) throw new TRPCError({ code: 'BAD_REQUEST' })
        await this.usersService.update(user._id.toString(), {
          isVerified: true,
        })
        return {
          success: true,
          message: 'Email successfully verified!',
          actionType: 'VERIFY_EMAIL',
        }
      }
      case 'CHANGE_EMAIL': {
        if (!tokenValues.oldEmail) throw new TRPCError({ code: 'BAD_REQUEST' })

        const user = await this.usersService.findOneByEmail(
          tokenValues.oldEmail
        )
        if (!user) throw new TRPCError({ code: 'BAD_REQUEST' })

        user.email = tokenValues.email
        await user.save()

        return {
          success: true,
          message: 'Email successfully changed!',
          actionType: 'CHANGE_EMAIL',
        }
      }
      default: {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid token' })
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
      throw new TRPCError({
        code: 'BAD_REQUEST',
      })
    }

    // this is in case the user signed up normally (has a password), yet sends no old password
    if (!oldPassword && user.password)
      throw new TRPCError({ code: 'BAD_REQUEST' })

    // only need to check this if the user HAS a password (i.e. didn't sign up via Google)
    if (user.password) {
      const passwordsMatch = await bcrypt.compare(oldPassword, user.password)
      if (!passwordsMatch) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        })
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    if (hashedPassword === user.password)
      throw new TRPCError({ code: 'BAD_REQUEST' })

    this.usersService.update(user._id.toString(), { password: hashedPassword })
  }

  async sendDeleteAccountEmail(email: string) {
    const payload: z.infer<typeof VerifyTokenSchema> = {
      email,
      action: 'DELETE_ACCOUNT',
    }
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_KEY,
    })

    const linkWithToken = `${process.env.WEB_BASE_URL}/auth/verify?token=${token}`

    try {
      this.mailService.sendMail({
        to: email,
        subject: `Delete Account of Niels' Graduation Project`,
        template: 'confirmDeleteAccount',
        context: {
          linkWithToken,
        },
      })
    } catch (error) {
      throw new TRPCError({ code: 'BAD_REQUEST' })
    }
  }

  async sendChangeEmailEmail(newEmail: string, oldEmail: string) {
    const payload: z.infer<typeof VerifyTokenSchema> = {
      email: newEmail,
      action: 'CHANGE_EMAIL',
      oldEmail,
    }
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_KEY,
    })

    const linkWithToken = `${process.env.WEB_BASE_URL}/auth/verify?token=${token}`

    try {
      this.mailService.sendMail({
        to: newEmail,
        subject: `Change email of your account at Niels' Graduation Project`,
        template: 'changeEmail',
        context: {
          linkWithToken,
        },
      })
    } catch (error) {
      throw new TRPCError({ code: 'BAD_REQUEST' })
    }
  }
}

import { CreateUserDto } from '@api/users/dto/create-user.dto'
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import bcrypt from 'bcryptjs'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
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

  async signUp(payload: CreateUserDto) {
    const user = await this.usersService.create(payload)
    return user
  }
}

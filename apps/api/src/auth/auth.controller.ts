import { SignInDto } from '@api/auth/dto/signIn.dto'
import { SignUpDto } from '@api/auth/dto/signUp.dto'
import { updatePasswordDto } from '@api/auth/dto/update-password.dto'
import { VerifyEmailDto } from '@api/auth/dto/verify-email.dto'
import { BaseUser } from '@api/users/dto/base-user.dto'
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { Public } from './public-strategy'

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /*
  Ideally, instead of using the Record<string, any> type, we should use a DTO class to define the shape of the request body. See the validation chapter for more information.
  */

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: [BaseUser],
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password)
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('verify')
  @ApiOperation({ summary: 'Verify User Email' })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: [BaseUser],
  })
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto)
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @ApiOperation({ summary: 'User Signup' })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: [BaseUser],
  })
  signUp(@Body() signUpDto: SignUpDto) {
    const payload = {
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      email: signUpDto.email,
      password: signUpDto.password,
    }
    return this.authService.signUp(payload)
  }

  @HttpCode(HttpStatus.OK)
  @Post('updatePassword')
  @ApiOperation({ summary: 'User Update Password' })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: [BaseUser],
  })
  updatePassword(@Body() updatePasswordDto: updatePasswordDto) {
    const payload = {
      oldPassword: updatePasswordDto.oldPassword,
      newPassword: updatePasswordDto.newPassword,
    }
    return this.authService.changePassword(payload)
  }

  @HttpCode(HttpStatus.OK)
  @Post('updateEmail')
  @ApiOperation({ summary: 'User Update Email' })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: [BaseUser],
  })
  updateEmail(@Body() updateEmailDto) {
    const payload = {
      newEmail: updateEmailDto.newEmail,
    }
    return this.authService.changeEmail(payload)
  }

  @HttpCode(HttpStatus.OK)
  @Post('deleteUser')
  @ApiOperation({ summary: 'User Delete' })
  @ApiResponse({
    status: 200,
    description: 'The record found',
    type: [BaseUser],
  })
  deleteUser(@Body() updateEmailDto) {
    const payload = {
      newEmail: updateEmailDto.newEmail,
    }
    return this.authService.deleteUser(payload)
  }
}

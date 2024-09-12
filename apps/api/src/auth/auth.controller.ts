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
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password)
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
  signUp(@Body() signUpDto: Record<string, any>) {
    const payload = {
      username: signUpDto.username,
      email: signUpDto.email,
      password: signUpDto.password,
      createdAt: new Date(),
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
  updatePassword(@Body() updatePasswordDto: Record<string, any>) {
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
  updateEmail(@Body() updateEmailDto: Record<string, any>) {
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
  deleteUser(@Body() updateEmailDto: Record<string, any>) {
    const payload = {
      newEmail: updateEmailDto.newEmail,
    }
    return this.authService.deleteUser(payload)
  }
}

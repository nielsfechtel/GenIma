import { IsOptional } from 'class-validator'

export class CreateUserDto {
  email: string

  password: string

  firstName: string

  @IsOptional()
  lastName: string
}

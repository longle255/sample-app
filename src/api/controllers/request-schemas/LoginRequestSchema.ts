import { IsEmail, IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

import { BaseRequestSchema } from './BaseRequestSchema';

export class LoginRequestSchema extends BaseRequestSchema {
  @IsNotEmpty()
  @MaxLength(250)
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  public password: string;

  @IsString()
  @MaxLength(128)
  @IsOptional()
  public twoFAToken: string;
}

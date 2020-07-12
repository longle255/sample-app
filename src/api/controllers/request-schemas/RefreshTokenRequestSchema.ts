import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { BaseRequestSchema } from './BaseRequestSchema';

export class RefreshTokenRequestSchema extends BaseRequestSchema {
  @IsNotEmpty()
  @MaxLength(250)
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  public token: string;
}

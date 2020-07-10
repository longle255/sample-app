import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { BaseRequestSchema } from './BaseRequestSchema';

export class UserChangePasswordSchema extends BaseRequestSchema {
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  public oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  public password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  public passwordConfirm: string;

  @IsString()
  @MaxLength(128)
  @IsOptional()
  public twoFAToken: string;
}

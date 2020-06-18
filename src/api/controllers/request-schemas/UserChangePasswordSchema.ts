import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
}

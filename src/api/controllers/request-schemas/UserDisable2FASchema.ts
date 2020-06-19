import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { BaseRequestSchema } from './BaseRequestSchema';

export class UserDisable2FASchema extends BaseRequestSchema {
  @IsNotEmpty()
  @IsString()
  public twoFAToken: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  public password: string;
}

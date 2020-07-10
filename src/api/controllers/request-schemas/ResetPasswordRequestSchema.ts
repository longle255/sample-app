import { IsNotEmpty, IsString, Length, MaxLength, MinLength } from 'class-validator';

import { BaseRequestSchema } from './BaseRequestSchema';

export class ResetPasswordRequestSchema extends BaseRequestSchema {
  @IsNotEmpty()
  @Length(105)
  @IsString()
  public token: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  @MinLength(6)
  public password: string;
}

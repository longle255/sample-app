import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { BaseRequestSchema } from './BaseRequestSchema';

export class RegisterRequestSchema extends BaseRequestSchema {
  @IsNotEmpty()
  @MaxLength(50)
  public firstName: string;

  @IsNotEmpty()
  @MaxLength(50)
  public lastName: string;

  @IsNotEmpty()
  @MaxLength(250)
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  @MinLength(6)
  public password: string;

  @IsString()
  @MaxLength(8)
  @IsOptional()
  public referCode?: string;
}

import { IsOptional, IsString } from 'class-validator';

import { BaseRequestSchema } from './BaseRequestSchema';

export class UserUpdateProfileSchema extends BaseRequestSchema {
  @IsOptional()
  @IsString()
  public firstName: string;

  @IsOptional()
  @IsString()
  public lastName: string;

  @IsOptional()
  @IsString()
  public phone: string;

  @IsOptional()
  @IsString()
  public address: string;

  @IsOptional()
  @IsString()
  public country: string;

  @IsOptional()
  @IsString()
  public city: string;
}

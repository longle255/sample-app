import { IsNotEmpty, IsString } from 'class-validator';

import { BaseRequestSchema } from './BaseRequestSchema';

export class SocialAuthRequestSchema extends BaseRequestSchema {
  @IsNotEmpty()
  @IsString()
  public userId: string;

  @IsNotEmpty()
  @IsString()
  public accessToken: string;

  @IsNotEmpty()
  @IsString()
  public service: string;
}

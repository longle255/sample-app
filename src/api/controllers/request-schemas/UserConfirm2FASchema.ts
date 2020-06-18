import { IsNotEmpty, IsString } from 'class-validator';

import { BaseRequestSchema } from './BaseRequestSchema';

export class UserConfirm2FASchema extends BaseRequestSchema {
  @IsNotEmpty()
  @IsString()
  public twoFAToken: string;
}

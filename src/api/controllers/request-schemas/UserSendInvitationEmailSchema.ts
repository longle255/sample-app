import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

import { BaseRequestSchema } from './BaseRequestSchema';

export class UserSendInvitationEmailSchema extends BaseRequestSchema {
  @IsArray()
  @IsNotEmpty()
  @IsEmail({}, { each: true })
  public emails: string[];
}

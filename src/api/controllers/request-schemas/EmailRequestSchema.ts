import { IsEmail, IsNotEmpty } from 'class-validator';

import { BaseRequestSchema } from './BaseRequestSchema';

export class EmailRequestSchema extends BaseRequestSchema {
  @IsNotEmpty()
  @IsEmail()
  public email: string;
}

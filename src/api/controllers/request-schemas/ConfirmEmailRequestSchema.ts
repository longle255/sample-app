import { IsNotEmpty, IsString, Length } from 'class-validator';
import { BaseRequestSchema } from './BaseRequestSchema';

export class ConfirmEmailRequestSchema extends BaseRequestSchema {
  @IsNotEmpty()
  @Length(105)
  @IsString()
  public token: string;
}

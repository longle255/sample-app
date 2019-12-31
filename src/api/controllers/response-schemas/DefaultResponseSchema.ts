import { IsNotEmpty, IsBoolean } from 'class-validator';

export class DefaultResponseSchema {
  @IsNotEmpty()
  @IsBoolean()
  public success: boolean;
  public message: string;

  constructor(success: boolean, message?: string) {
      this.success = success;
      this.message = message;
  }
}

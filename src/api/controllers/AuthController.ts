import { Body, JsonController, Post, UseBefore } from 'routing-controllers';

import { CaptchaMiddleware } from '../middlewares/CaptchaMiddleware';
import { IUser } from '../models/User';
import { AuthService, ITokenInfo } from '../services/AuthService';
import {
  ConfirmEmailRequestSchema,
  EmailRequestSchema,
  LoginRequestSchema,
  RegisterRequestSchema,
  ResetPasswordRequestSchema,
} from './request-schemas';
import { SocialAuthRequestSchema } from './request-schemas/SocialAuthRequestSchema';
import { DefaultResponseSchema } from './response-schemas/DefaultResponseSchema';
import { RefreshTokenRequestSchema } from './request-schemas/RefreshTokenRequestSchema';

@JsonController('/auth')
export class UserController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UseBefore(CaptchaMiddleware)
  public async login(@Body({ validate: true }) credential: LoginRequestSchema): Promise<ITokenInfo> {
    return this.authService.login(credential);
  }

  @Post('/refresh-token')
  public async refreshToken(@Body({ validate: true }) token: RefreshTokenRequestSchema): Promise<ITokenInfo> {
    return this.authService.refreshToken(token);
  }

  @Post('/social')
  public async socialAuth(@Body() data: SocialAuthRequestSchema): Promise<ITokenInfo> {
    return this.authService.socialAuth(data);
  }

  @Post('/register')
  public async register(@Body({ validate: true }) account: RegisterRequestSchema): Promise<IUser> {
    return this.authService.register(account);
  }

  @Post('/confirm-email')
  @UseBefore(CaptchaMiddleware)
  public async confirmEmail(@Body({ validate: true }) body: ConfirmEmailRequestSchema): Promise<DefaultResponseSchema> {
    return this.authService.confirmEmail(body);
  }

  @Post('/resend-confirm-email')
  @UseBefore(CaptchaMiddleware)
  public async resendConfirmEmail(@Body({ validate: true }) body: EmailRequestSchema): Promise<DefaultResponseSchema> {
    return this.authService.resendConfirmEmail(body);
  }

  @Post('/forgot-password')
  @UseBefore(CaptchaMiddleware)
  public async forgotPassword(@Body({ validate: true }) body: EmailRequestSchema): Promise<DefaultResponseSchema> {
    return this.authService.forgotPassword(body);
  }

  @Post('/reset-password')
  public async resetPassword(@Body({ validate: true }) body: ResetPasswordRequestSchema): Promise<IUser> {
    return this.authService.resetPassword(body);
  }
}

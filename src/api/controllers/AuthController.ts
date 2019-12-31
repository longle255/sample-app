import { Body, JsonController, Post, UseBefore } from 'routing-controllers';

import { AuthService, ITokenInfo } from '../services/AuthService';
import { CaptchaMiddleware } from '../middlewares/CaptchaMiddleware';
import { ValidateResult } from '../validators/ValidateResult';
import {
    LoginRequestSchema,
    RegisterRequestSchema,
    ConfirmEmailRequestSchema,
    EmailRequestSchema,
    ResetPasswordRequestSchema,
} from './request-schemas';
import { InvalidInputError } from '../errors/InvalidInputError';
import { IUser } from '../models/User';
import { DefaultResponseSchema } from './response-schemas/DefaultResponseSchema';

@JsonController('/auth')
export class UserController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    @UseBefore(CaptchaMiddleware)
    public async login(@Body() credential: LoginRequestSchema): Promise<ITokenInfo> {
        const validation: ValidateResult = await credential.validate();
        if (validation.valid) {
            return this.authService.login(credential);
        }
        throw new InvalidInputError('Input is not valid', validation.error);
    }

    @Post('/register')
    public async register(@Body() account: RegisterRequestSchema): Promise<IUser> {
        const validation: ValidateResult = await account.validate();
        if (validation.valid) {
            return this.authService.register(account);
        }
        throw new InvalidInputError('Input is not valid', validation.error);
    }

    @Post('/confirm-email')
    @UseBefore(CaptchaMiddleware)
    public async confirmEmail(@Body() body: ConfirmEmailRequestSchema): Promise<DefaultResponseSchema> {
        const validation: ValidateResult = await body.validate();
        if (validation.valid) {
            return this.authService.confirmEmail(body);
        }
        throw new InvalidInputError('Input is not valid', validation.error);
    }

    @Post('/resend-confirm-email')
    @UseBefore(CaptchaMiddleware)
    public async resendConfirmEmail(@Body() body: EmailRequestSchema): Promise<DefaultResponseSchema> {
        const validation: ValidateResult = await body.validate();
        if (validation.valid) {
            return this.authService.resendConfirmEmail(body);
        }
        throw new InvalidInputError('Input is not valid', validation.error);
    }

    @Post('/forgot-password')
    @UseBefore(CaptchaMiddleware)
    public async forgotPassword(@Body() body: EmailRequestSchema): Promise<DefaultResponseSchema> {
        const validation: ValidateResult = await body.validate();
        if (validation.valid) {
            return this.authService.forgotPassword(body);
        }
        throw new InvalidInputError('Input is not valid', validation.error);
    }

    @Post('/reset-password')
    public async resetPassword(@Body() body: ResetPasswordRequestSchema): Promise<IUser> {
        const validation: ValidateResult = await body.validate();
        if (validation.valid) {
            return this.authService.resetPassword(body);
        }
        throw new InvalidInputError('Input is not valid', validation.error);
    }
}

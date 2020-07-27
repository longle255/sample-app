import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  HttpCode,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Put,
  QueryParams,
  UseBefore,
} from 'routing-controllers';

import { DocumentType } from '@typegoose/typegoose';

import { RecordNotFoundError } from '../errors/RecordNotFoundError';
import { CaptchaMiddleware } from '../middlewares/CaptchaMiddleware';
import { IUser, ROLES_ALL } from '../models/User';
import { Pagination } from '../services/Pagination';
import { UserService } from '../services/UserService';
import {
  UserChangePasswordSchema,
  UserConfirm2FASchema,
  UserDisable2FASchema,
  UserSendInvitationEmailSchema,
  UserUpdateProfileSchema,
} from './request-schemas';
import { DefaultResponseSchema } from './response-schemas/DefaultResponseSchema';

@JsonController('/users')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  @Authorized('admin')
  public findAll(@QueryParams() params: any): Promise<Pagination<IUser>> {
    return this.userService.paginate({
      pageSize: params.pageSize ? parseInt(params.pageSize, 10) : 10,
      pageNumber: params.pageNumber ? parseInt(params.pageNumber, 10) : 0,
      cond: params.cond ? params.cond : {},
    });
  }

  @Get('/:id([0-9a-f]{24})')
  @Authorized('admin')
  @OnUndefined(RecordNotFoundError)
  public one(@Param('id') id: string): Promise<IUser | undefined> {
    return this.userService.findOne({ _id: id });
  }

  @Post()
  @HttpCode(201)
  @Authorized('admin')
  public create(@Body() user: IUser): Promise<IUser> {
    return this.userService.create(user);
  }

  @Put('/:id')
  @Authorized('admin')
  public update(@Param('id') id: string, @Body() user: IUser): Promise<IUser> {
    return this.userService.update(id, user);
  }

  @Delete('/:id')
  @Authorized('admin')
  public delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }

  @Get('/profile')
  @Authorized(ROLES_ALL)
  public async findMe(@CurrentUser() user?: DocumentType<IUser>): Promise<DocumentType<IUser>> {
    return this.userService.findOne({ _id: user._id });
  }

  @Put('/profile/update')
  @Authorized(ROLES_ALL)
  public async updateProfile(
    @CurrentUser() user: DocumentType<IUser>,
    @Body({ validate: { whitelist: true, forbidNonWhitelisted: true } }) body: UserUpdateProfileSchema,
  ): Promise<DocumentType<IUser>> {
    return this.userService.updateProfile(user._id, body);
  }

  @Put('/profile/change-password')
  @Authorized(ROLES_ALL)
  public async changePassword(
    @CurrentUser() user: DocumentType<IUser>,
    @Body({ validate: true }) body: UserChangePasswordSchema,
  ): Promise<DefaultResponseSchema> {
    return this.userService.changePasswordWithVerification(user._id, body);
  }

  @Put('/profile/enable-2fa')
  @Authorized(ROLES_ALL)
  public async enable2FA(@CurrentUser() user: DocumentType<IUser>): Promise<any> {
    return this.userService.enable2FA(user._id);
  }

  @Put('/profile/confirm-2fa')
  @Authorized(ROLES_ALL)
  public async confirm2FA(
    @CurrentUser() user: DocumentType<IUser>,
    @Body({ validate: true }) body: UserConfirm2FASchema,
  ): Promise<DefaultResponseSchema> {
    return this.userService.confirm2FA(user._id, body);
  }

  @Put('/profile/disable-2fa')
  @Authorized(ROLES_ALL)
  public async disable2FA(
    @CurrentUser() user: DocumentType<IUser>,
    @Body({ validate: true }) body: UserDisable2FASchema,
  ): Promise<DefaultResponseSchema> {
    return this.userService.disable2FA(user._id, body);
  }

  @Post('/profile/send-invitation')
  @Authorized(ROLES_ALL)
  @UseBefore(CaptchaMiddleware)
  public async sendInvitationEmail(
    @CurrentUser() user: DocumentType<IUser>,
    @Body({ validate: true }) body: UserSendInvitationEmailSchema,
  ): Promise<DefaultResponseSchema> {
    return this.userService.sendInvitationEmail(user._id, body);
  }

  @Get('/profile/referrals')
  @Authorized(ROLES_ALL)
  public async getReferrals(@CurrentUser() user: DocumentType<IUser>, @QueryParams() params: any): Promise<Pagination<IUser>> {
    return this.userService.getReferrals(user._id, {
      pageSize: params.pageSize ? parseInt(params.pageSize, 10) : 10,
      pageNumber: params.pageNumber ? parseInt(params.pageNumber, 10) : 0,
      cond: params.cond ? params.cond : {},
    });
  }
}

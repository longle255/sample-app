import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Post,
  Put,
  Req,
  QueryParams,
  CurrentUser,
  HttpCode,
} from 'routing-controllers';
import { IUser } from '../models/User';
import { UserService } from '../services/UserService';
import { DocumentType } from '@typegoose/typegoose';
import { RecordNotFoundError } from '../errors/RecordNotFoundError';
import { Pagination } from '../services/Pagination';
import { UserChangePasswordSchema } from './request-schemas/UserChangePasswordSchema';
import { DefaultResponseSchema } from './response-schemas/DefaultResponseSchema';
import { UserConfirm2FASchema } from './request-schemas/UserConfirm2FASchema';
import { UserDisable2FASchema } from './request-schemas/UserDisable2FASchema';

@Authorized('admin')
@JsonController('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  public findAll(@QueryParams() params: any): Promise<Pagination<IUser>> {
    return this.userService.paginate({
      limit: params.limit ? parseInt(params.limit, 10) : 10,
      page: params.page ? parseInt(params.page, 10) : 0,
      cond: params.cond ? params.cond : {},
    });
  }

  @Get('/:id([0-9a-f]{24})')
  @OnUndefined(RecordNotFoundError)
  public one(@Param('id') id: string): Promise<IUser | undefined> {
    return this.userService.findOne({ _id: id });
  }

  @Post()
  @HttpCode(201)
  public create(@Body() user: IUser): Promise<IUser> {
    return this.userService.create(user);
  }

  @Put('/:id')
  public update(@Param('id') id: string, @Body() user: IUser): Promise<IUser> {
    return this.userService.update(id, user);
  }

  @Delete('/:id')
  public delete(@Param('id') id: string): Promise<void> {
    return this.userService.delete(id);
  }

  @Get('/profile')
  @Authorized('user')
  public async findMe(@Req() req: any, @CurrentUser() user?: DocumentType<IUser>): Promise<DocumentType<IUser>> {
    return this.userService.findOne({ _id: user._id });
  }

  @Post('/profile/change-password')
  @Authorized('user')
  public async changePassword(
    @CurrentUser() user: DocumentType<IUser>,
    @Body({ validate: true }) body: UserChangePasswordSchema,
  ): Promise<DefaultResponseSchema> {
    return this.userService.changePasswordWithVerification(user._id, body);
  }

  @Post('/profile/enable-2fa')
  @Authorized('user')
  public async enable2FA(@CurrentUser() user: DocumentType<IUser>): Promise<any> {
    return this.userService.enable2FA(user._id);
  }

  @Post('/profile/confirm-2fa')
  @Authorized('user')
  public async confirm2FA(
    @CurrentUser() user: DocumentType<IUser>,
    @Body({ validate: true }) body: UserConfirm2FASchema,
  ): Promise<DefaultResponseSchema> {
    return this.userService.confirm2FA(user._id, body);
  }

  @Post('/profile/disable-2fa')
  @Authorized('user')
  public async disable2FA(
    @CurrentUser() user: DocumentType<IUser>,
    @Body({ validate: true }) body: UserDisable2FASchema,
  ): Promise<DefaultResponseSchema> {
    return this.userService.disable2FA(user._id, body);
  }
}

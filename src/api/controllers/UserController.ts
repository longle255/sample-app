import {
    Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, State
} from 'routing-controllers';

import { UserNotFoundError } from '../errors/UserNotFoundError';
import { IUser } from '../models/User';
import { UserService } from '../services/UserService';
import { InstanceType } from 'typegoose';

@Authorized('admin')
@JsonController('/users')
export class UserController {

    constructor(
        private userService: UserService
    ) { }

    @Get()
    public find(): Promise<IUser[]> {
        return this.userService.find();
    }

    @Get('/profile')
    @Authorized('user')
    public async findMe(@Req() req: any, @State('user') user: InstanceType<IUser>): Promise<InstanceType<IUser>> {
        const ret = await this.userService.findOne({_id: user._id});
        return ret.toJSON();
    }

    @Get('/:id([0-9a-f]{24})')
    @OnUndefined(UserNotFoundError)
    public one(@Param('id') id: string): Promise<IUser | undefined> {
        return this.userService.findOne({_id: id});
    }

    @Post()
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

}

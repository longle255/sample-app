import { Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, State } from 'routing-controllers';
import { IUser } from '../models/User';
import { UserService } from '../services/UserService';
import { InstanceType } from 'typegoose';
import { RecordNotFoundError } from '../errors/RecordNotFoundError';

@Authorized('admin')
@JsonController('/users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    public findAll(): Promise<IUser[]> {
        return this.userService.find();
    }

    @Get('/profile')
    @Authorized('user')
    public async findMe(@Req() req: any, @State('user') user: InstanceType<IUser>): Promise<InstanceType<IUser>> {
        return this.userService.findOne({ _id: user._id });
    }

    @Get('/:id([0-9a-f]{24})')
    @OnUndefined(RecordNotFoundError)
    public one(@Param('id') id: string): Promise<IUser | undefined> {
        return this.userService.findOne({ _id: id });
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

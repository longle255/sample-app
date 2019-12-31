import { Body, Delete, Get, OnUndefined, Param, Post, Put } from 'routing-controllers';
import { BaseSchema } from '../models/BaseModel';
import { BaseService } from '../services/BaseService';
import { RecordNotFoundError } from '../errors/RecordNotFoundError';

// @JsonController()
export abstract class BaseController<ISchema extends BaseSchema> {
    constructor(private baseService: BaseService<ISchema>) {}

    @Get()
    public find(): Promise<ISchema[]> {
        return this.baseService.find();
    }

    @Get('/:id([0-9a-f]{24})')
    @OnUndefined(RecordNotFoundError)
    public one(@Param('id') id: string): Promise<ISchema | undefined> {
        return this.baseService.findOne({ _id: id });
    }

    @Post()
    public create(@Body() user: ISchema): Promise<ISchema> {
        return this.baseService.create(user);
    }

    @Put('/:id')
    public update(@Param('id') id: string, @Body() user: ISchema): Promise<ISchema> {
        return this.baseService.update(id, user);
    }

    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<void> {
        return this.baseService.delete(id);
    }
}

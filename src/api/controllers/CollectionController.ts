import { Authorized, Body, Delete, Get, JsonController, OnUndefined, Param, Post, Put, Req, State } from 'routing-controllers';

import { CollectionNotFoundError } from '../errors/CollectionNotFoundError';
import { ICollection } from '../models/Collection';
import { CollectionService } from '../services/CollectionService';
import { InstanceType } from 'typegoose';

@Authorized('admin')
@JsonController('/collections')
export class CollectionController {
    constructor(private collectionService: CollectionService) {}

    @Get()
    public find(): Promise<ICollection[]> {
        return this.collectionService.find();
    }

    @Get('/profile')
    @Authorized('collection')
    public async findMe(@Req() req: any, @State('collection') collection: InstanceType<ICollection>): Promise<InstanceType<ICollection>> {
        const ret = await this.collectionService.findOne({ _id: collection._id });
        return ret.toJSON();
    }

    @Get('/:id([0-9a-f]{24})')
    @OnUndefined(CollectionNotFoundError)
    public one(@Param('id') id: string): Promise<ICollection | undefined> {
        return this.collectionService.findOne({ _id: id });
    }

    @Post()
    public create(@Body() collection: ICollection): Promise<ICollection> {
        return this.collectionService.create(collection);
    }

    @Put('/:id')
    public update(@Param('id') id: string, @Body() collection: ICollection): Promise<ICollection> {
        return this.collectionService.update(id, collection);
    }

    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<void> {
        return this.collectionService.delete(id);
    }
}

import { JsonController, Get, OnUndefined, Param, Body, Post, Put, Delete } from 'routing-controllers';
import { ICollection, Collection } from '../models/Collection';
import { CollectionService } from '../services/CollectionService';
import { RecordNotFoundError } from '../errors/RecordNotFoundError';

@JsonController('/collections')
export class CollectionController {
    constructor(private collectionService: CollectionService) {}

    @Get()
    public findAll(): Promise<ICollection[]> {
        return this.collectionService.find();
    }

    @Get('/:id([0-9a-f]{24})')
    @OnUndefined(RecordNotFoundError)
    public one(@Param('id') id: string): Promise<ICollection | undefined> {
        return this.collectionService.findOne({ _id: id });
    }

    @Post()
    public async create(@Body() collection: ICollection): Promise<ICollection> {
        return this.collectionService.create(collection);
    }

    @Put('/:id')
    public async update(@Param('id') id: string, @Body() collection: ICollection): Promise<ICollection> {
        return this.collectionService.update(id, collection);
    }

    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<void> {
        return this.collectionService.delete(id);
    }
}

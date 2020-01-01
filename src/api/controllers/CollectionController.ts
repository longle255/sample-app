import { JsonController, Get, OnUndefined, Param, Body, Post, Put, Delete, QueryParams } from 'routing-controllers';
import { ICollection } from '../models/Collection';
import { CollectionService } from '../services/CollectionService';
import { RecordNotFoundError } from '../errors/RecordNotFoundError';
import { Pagination } from '../services/Pagination';

@JsonController('/collections')
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @Get()
  public findAll(@QueryParams() params: any): Promise<Pagination<ICollection>> {
    return this.collectionService.paginate({
      limit: params.limit ? parseInt(params.limit, 10) : 10,
      page: params.page ? parseInt(params.page, 10) : 0,
      cond: params.cond ? params.cond : {},
    });
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

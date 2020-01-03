import { JsonController, Get, OnUndefined, Param, Body, Post, Put, Delete, QueryParams, State, Authorized } from 'routing-controllers';
import { ICollection } from '../models/Collection';
import { CollectionService } from '../services/CollectionService';
import { RecordNotFoundError } from '../errors/RecordNotFoundError';
import { Pagination } from '../services/Pagination';
import { IUser } from '../models/User';
import { DocumentType } from '@typegoose/typegoose';

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
    return this.collectionService.findOneAndIncreaseView(id);
  }

  @Get('/likes')
  @Authorized()
  public likes(@QueryParams() params: any, @State('user') user: DocumentType<IUser>): Promise<Pagination<ICollection>> {
    return this.collectionService.getLikes(user, {
      limit: params.limit ? parseInt(params.limit, 10) : 10,
      page: params.page ? parseInt(params.page, 10) : 0,
      cond: params.cond ? params.cond : {},
    });
  }

  @Post('/:id([0-9a-f]{24})/likes')
  @OnUndefined(RecordNotFoundError)
  @Authorized()
  public like(@Param('id') id: string, @State('user') user: DocumentType<IUser>): Promise<ICollection | undefined> {
    return this.collectionService.like(user, id);
  }

  @Delete('/:id([0-9a-f]{24})/likes')
  @OnUndefined(RecordNotFoundError)
  @Authorized()
  public unlike(@Param('id') id: string, @State('user') user: DocumentType<IUser>): Promise<ICollection | undefined> {
    return this.collectionService.unlike(user, id);
  }

  @Post()
  public async create(@Body() collection: ICollection): Promise<ICollection> {
    return this.collectionService.create(collection);
  }

  @Put('/:id([0-9a-f]{24})')
  public async update(@Param('id') id: string, @Body() collection: ICollection): Promise<ICollection> {
    return this.collectionService.update(id, collection);
  }

  @Delete('/:id([0-9a-f]{24})')
  public delete(@Param('id') id: string): Promise<void> {
    return this.collectionService.delete(id);
  }
}

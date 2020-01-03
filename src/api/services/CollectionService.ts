import * as _ from 'lodash';
import { Service } from 'typedi';
import { Logger } from '../../lib/logger';
import { BaseService } from './BaseService';
import { ICollection, Collection } from '../models/Collection';
import { IUser } from '../models/User';
import { DocumentType } from '@typegoose/typegoose';
import { Like } from '../models/Like';
import { BadRequestError } from 'routing-controllers';
import { PaginationOptionsInterface, Pagination, defaultOption } from './Pagination';

@Service()
export class CollectionService extends BaseService<ICollection> {
  constructor() {
    super(new Logger(__filename), Collection);
  }

  public async getAll(user: DocumentType<IUser>, options: PaginationOptionsInterface): Promise<Pagination<ICollection>> {
    options = _.defaultsDeep({}, options, defaultOption);
    const ret: any = await this.model.aggregate([
      { $match: options.cond },
      { $sort: options.sort },
      {
        $facet: {
          paging: [{ $count: 'total' }, { $addFields: { page: options.page, limit: options.limit } }],
          results: [{ $skip: options.page * options.limit }, { $limit: options.limit }], // add projection here wish you re-shape the docs
        },
      },
    ]);
    if (!ret.length) {
      return new Pagination<ICollection>({
        results: [],
        items_count: 0,
        pages_count: 0,
        page: 0,
      });
    }
    const liked = (await Like.find({ user, isActive: true })).map((like: any) => like.coll._id.toString());
    const results = ret[0].results.map((coll: DocumentType<ICollection>) =>
      new this.model(coll).reduce(liked.indexOf(coll._id.toHexString()) >= 0),
    );
    return new Pagination<ICollection>({
      items_count: ret[0].paging[0].total,
      pages_count: Math.ceil(ret[0].paging[0].total / options.limit),
      page: ret[0].paging[0].page,
      results,
    });
  }

  public async getLikes(user: DocumentType<IUser>, options: PaginationOptionsInterface): Promise<Pagination<ICollection>> {
    options = Object.assign({}, defaultOption, options);
    const total = await Like.count({ user, isActive: true });
    const pageCount = Math.ceil(total / options.limit);
    const page = options.page;
    const likes = await Like.find({ user, isActive: true })
      .skip(options.page * options.limit)
      .limit(options.limit)
      .populate('coll');
    const results: any = likes.map((like: any) => like.coll).map(coll => coll.reduce(true));
    return new Pagination<ICollection>({
      results,
      items_count: total,
      pages_count: pageCount,
      page,
    });
  }

  public findOneAndIncreaseView(user: DocumentType<IUser>, colId: string): Promise<ICollection | undefined> {
    this.log.debug(`Find one ${this.model.modelName} ${colId} and increase view for user ${JSON.stringify(user)}`);
    return new Promise<ICollection>(async (resolve, reject) => {
      try {
        const result = await this.model.findOneAndUpdate({ _id: colId }, { $inc: { views: 1 } }, { new: true });
        const liked = await Like.findOne({ coll: colId, user, isActive: true });
        const obj = result.toJSON();
        obj.photosCount = obj.photos.length;
        obj.liked = !_.isNil(liked);
        resolve(obj);
      } catch (err) {
        reject(err);
      }
    });
  }

  public like(user: DocumentType<IUser>, colId: string): Promise<ICollection | undefined> {
    this.log.debug(`Like one ${this.model.modelName} for user ${JSON.stringify(user)}`);
    return new Promise<ICollection>(async (resolve, reject) => {
      try {
        const like = await Like.findOne({ coll: colId, user: user._id, isActive: true });
        if (like) {
          return reject(new BadRequestError('Already like this collection'));
        }
        let coll = await this.model.findOneAndUpdate({ _id: colId }, { $inc: { likes: 1 } }, { new: true });
        if (!coll) {
          return resolve(coll);
        }
        await Like.findOneAndUpdate(
          { coll: colId, user: user._id },
          {
            coll,
            user,
            isActive: true,
          },
          { upsert: true },
        );
        coll = coll.reduce(true);
        resolve(coll);
      } catch (err) {
        reject(err);
      }
    });
  }

  public unlike(user: DocumentType<IUser>, colId: string): Promise<ICollection | undefined> {
    this.log.debug(`Unlike one ${this.model.modelName} for user ${JSON.stringify(user)}`);
    return new Promise<ICollection>(async (resolve, reject) => {
      try {
        const like = await Like.findOne({ coll: colId, user: user._id, isActive: true });
        if (!like) {
          return reject(new BadRequestError('Have not liked this collection'));
        }
        let coll = await this.model.findOneAndUpdate({ _id: colId }, { $inc: { likes: -1 } }, { new: true });
        if (!coll) {
          return resolve(coll);
        }
        await Like.findOneAndUpdate(
          { coll: colId, user: user._id },
          {
            coll,
            user,
            isActive: false,
          },
          { upsert: false },
        );
        coll = coll.reduce(false);
        resolve(coll);
      } catch (err) {
        reject(err);
      }
    });
  }
}

import createHttpError from 'http-errors';
import _ from 'lodash';
import { Service } from 'typedi';
import { DocumentType } from '@typegoose/typegoose';
import { LoggerInterface } from '../../decorators/Logger';
import { Model as BaseModel } from 'mongoose';
import { BaseSchema } from '../models/BaseModel';
import { EventDispatcher } from 'event-dispatch';
import { events } from '../subscribers/events';
import { Pagination, PaginationOptionsInterface, defaultOption } from './Pagination';

@Service()
export abstract class BaseService<E extends BaseSchema> {
  public model: BaseModel<any, any>;
  protected log: LoggerInterface;
  private eventDispatcher: EventDispatcher;

  constructor(log: LoggerInterface, model: BaseModel<any, any>) {
    this.log = log;
    this.model = model;
    this.eventDispatcher = new EventDispatcher();
  }

  public async paginate(options: PaginationOptionsInterface): Promise<Pagination<E>> {
    options = _.defaultsDeep({}, options, defaultOption);

    const ret: any = await this.model.aggregate([
      { $match: options.cond },
      { $sort: options.sort },
      {
        $facet: {
          paging: [{ $count: 'total' }, { $addFields: { page: options.pageNumber, limit: options.pageSize } }],
          results: [{ $skip: options.pageNumber * options.pageSize }, { $limit: options.pageSize }], // add projection here wish you re-shape the docs
        },
      },
    ]);
    if (!ret.length) {
      return new Pagination<E>({
        total: 0,
        pagesCount: 0,
        pageNumber: 0,
        pageSize: options.pageSize,
        results: [],
      });
    }
    return new Pagination<E>({
      total: ret[0].paging[0].total,
      pagesCount: Math.ceil(ret[0].paging[0].total / options.pageSize),
      pageNumber: ret[0].paging[0].page,
      pageSize: options.pageSize,
      results: ret[0].results.map(d => new this.model(d).toJSON()),
    });
  }

  public find(cond?: object): Promise<Array<DocumentType<E>>> {
    this.log.debug(`Find all ${this.model.modelName}`);
    return new Promise<Array<DocumentType<E>>>(async (resolve, reject) => {
      try {
        const result = await this.model.find(cond);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }

  public findOne(cond: object): Promise<DocumentType<E> | undefined> {
    this.log.debug(`Find one ${this.model.modelName} with condition ${cond}`);
    return new Promise<DocumentType<E>>(async (resolve, reject) => {
      try {
        const result = await this.model.findOne(cond);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }

  public async create(instant: E): Promise<DocumentType<E>> {
    this.log.debug(`Create a new ${this.model.modelName} => `, JSON.stringify(instant));
    return new Promise<DocumentType<E>>(async (resolve, reject) => {
      try {
        const result = await this.model.create(instant);
        if (events[this.model.modelName]) {
          this.eventDispatcher.dispatch(events[this.model.modelName].created, result);
        }
        resolve(result);
      } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
          return reject(createHttpError(409, 'Duplicate key'));
        }
        reject(err);
      }
    });
  }

  public update(id: any, body: any): Promise<DocumentType<E>> {
    this.log.debug(`Update an ${this.model.modelName}`);
    return new Promise<DocumentType<E>>(async (resolve, reject) => {
      const updateData = _.omit(body, ['id']);
      return this.model
        .findOneAndUpdate({ _id: id }, updateData, { new: true, select: {} })
        .then((result: DocumentType<E>) => {
          resolve(result);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  public async delete(id: any): Promise<void> {
    this.log.debug(`Delete an ${this.model.modelName}`);
    return new Promise<void>(async (resolve, reject) => {
      return this.model
        .findByIdAndRemove({ _id: id })
        .then((result: E) => {
          resolve();
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }
}

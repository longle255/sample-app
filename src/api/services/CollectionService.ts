import * as _ from 'lodash';
import { Service } from 'typedi';
import { Logger } from '../../lib/logger';
import { BaseService } from './BaseService';
import { ICollection, Collection } from '../models/Collection';
import { IUser } from '../models/User';
import { DocumentType } from '@typegoose/typegoose';
import { Like } from '../models/Like';
import { BadRequestError } from 'routing-controllers';

@Service()
export class CollectionService extends BaseService<ICollection> {
  constructor() {
    super(new Logger(__filename), Collection);
  }

  public findOneAndIncreaseView(colId: string): Promise<ICollection | undefined> {
    this.log.debug(`Find one ${this.model.modelName} and increase view`);
    return new Promise<ICollection>(async (resolve, reject) => {
      try {
        const result = await this.model.findOneAndUpdate({ _id: colId }, { $inc: { views: 1 } }, { new: true });
        resolve(result);
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
        const coll = await this.model.findOneAndUpdate({ _id: colId }, { $inc: { likes: 1 } }, { new: true });
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
        const coll = await this.model.findOneAndUpdate({ _id: colId }, { $inc: { likes: -1 } }, { new: true });
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
        resolve(coll);
      } catch (err) {
        reject(err);
      }
    });
  }
}

import * as _ from 'lodash';
import mongoose from 'mongoose';
import { prop, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose';
import { BaseSchema, defaultOptions } from './BaseModel';
import { IUser } from './User';
import { ICollection } from './Collection';

const schemaOptions = Object.assign({}, defaultOptions, {
  collection: 'likes',
});

@modelOptions({ existingMongoose: mongoose, schemaOptions })
export class ILike extends BaseSchema {
  @prop({ ref: IUser, required: true })
  public user: Ref<IUser>;

  @prop({ ref: ICollection, required: true })
  public coll: Ref<ICollection>;
}

export const Like = getModelForClass(ILike);

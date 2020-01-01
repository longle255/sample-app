import * as _ from 'lodash';
import mongoose from 'mongoose';
import { prop, Ref, getModelForClass, modelOptions } from '@typegoose/typegoose';

import { BaseSchema, defaultOptions } from './BaseModel';
import { IUser } from './User';

const schemaOptions = Object.assign(
  {},
  {
    collection: 'emails',
  },
  defaultOptions,
);

@modelOptions({ existingMongoose: mongoose, schemaOptions })
export class IEmail extends BaseSchema {
  @prop({ ref: IUser, required: false })
  public user: Ref<IUser>;

  @prop({ required: true })
  public email: string;

  @prop({ required: true })
  public template: string;

  @prop({ required: true })
  public payload: object;
}

export const Email = getModelForClass(IEmail);

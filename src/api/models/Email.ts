import mongoose from 'mongoose';

import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';

import { BaseSchema, defaultOptions, defaultSchemaOptions } from './BaseModel';
import { IUser } from './User';

const schemaOptions = Object.assign({}, defaultSchemaOptions, {
  collection: 'emails',
});

@modelOptions({ existingMongoose: mongoose, schemaOptions, options: defaultOptions })
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

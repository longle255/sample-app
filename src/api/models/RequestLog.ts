import mongoose from 'mongoose';

import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';

import { BaseSchema, defaultOptions, defaultSchemaOptions } from './BaseModel';
import { IUser } from './User';

const schemaOptions = Object.assign({}, defaultSchemaOptions, {
  collection: 'request-logs',
});

@modelOptions({ existingMongoose: mongoose, schemaOptions, options: defaultOptions })
export class IRequestLog extends BaseSchema {
  @prop({ ref: IUser, required: false })
  public user: Ref<IUser>;
  @prop()
  public path: string;
  @prop()
  public method: string;
  @prop()
  public ip: string;
  @prop()
  public headers: object;
  @prop()
  public query: object;
  @prop()
  public body: object;
  @prop()
  public resCode: number;
  @prop()
  public resBody: string;
  @prop()
  public resTime: number;
}

export const RequestLog = getModelForClass(IRequestLog);

import * as _ from 'lodash';
import mongoose from 'mongoose';
import { prop, Ref, getModelForClass, modelOptions } from '@typegoose/typegoose';

import { BaseSchema, defaultSchemaOptions, defaultOptions } from './BaseModel';
import { IUser } from './User';

export enum TokenTypes {
  RESET_PASSWORD = 'reset-password',
  REFRESH_TOKEN = 'refresh-token',
  EMAIL_CONFIRMATION = 'email-confirmation',
}
const schemaOptions = Object.assign({}, defaultSchemaOptions, {
  collection: 'identity-tokens',
});

@modelOptions({ existingMongoose: mongoose, schemaOptions, options: defaultOptions })
export class IIdentityToken extends BaseSchema {
  @prop({ required: true, index: true })
  public token: string;

  @prop({ ref: IUser, required: true })
  public user: Ref<IUser>;

  @prop({ required: true })
  public email: string;

  @prop()
  public expires: Date;

  @prop({
    enum: TokenTypes,
    default: TokenTypes.REFRESH_TOKEN,
  })
  public type: string;
}

export const IdentityToken = getModelForClass(IIdentityToken);

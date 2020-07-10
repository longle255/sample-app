import mongoose from 'mongoose';

import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';

import { BaseSchema, defaultOptions, defaultSchemaOptions } from './BaseModel';
import { IUser } from './User';

const schemaOptions = Object.assign({}, defaultSchemaOptions, {
  collection: 'invitations',
});

@modelOptions({ existingMongoose: mongoose, schemaOptions, options: defaultOptions })
export class IInvitation extends BaseSchema {
  @prop({ ref: IUser, required: true })
  public invitedBy: Ref<IUser>;

  @prop({ required: true })
  public email: string;
}

export const Invitation = getModelForClass(IInvitation);

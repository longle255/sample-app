import * as _ from 'lodash';
import mongoose from 'mongoose';
import { prop, getModelForClass, modelOptions, Ref } from '@typegoose/typegoose';
import { BaseSchema, defaultOptions } from './BaseModel';
import { IUser } from './User';

const schemaOptions = Object.assign({}, defaultOptions, {
  collection: 'invitations',
});

@modelOptions({ existingMongoose: mongoose, schemaOptions })
export class IInvitation extends BaseSchema {
  @prop({ ref: IUser, required: true })
  public invitedBy: Ref<IUser>;

  @prop({ required: true })
  public email: string;
}

export const Invitation = getModelForClass(IInvitation);

import bcrypt from 'bcryptjs';
import * as _ from 'lodash';
import mongoose from 'mongoose';
import { DocumentType, pre, prop, Ref, getModelForClass, modelOptions, arrayProp } from '@typegoose/typegoose';

import { BaseSchema, defaultOptions } from './BaseModel';

export enum Roles {
  ADMIN = 'admin',
  CONTRIBUTOR = 'contributor',
  USER = 'user',
  APP = 'app',
}

const schemaOptions = Object.assign({}, defaultOptions, {
  collection: 'users',
});

async function genUniqueReferralCode(): Promise<string> {
  let code = Math.random()
    .toString(36)
    .substring(2, 8);
  let exist = await User.findOne({ referralCode: code }).exec();
  while (exist) {
    code = Math.random()
      .toString(36)
      .substring(2, 8);
    exist = await User.findOne({ referralCode: code }).exec();
  }
  return code;
}

@pre<IUser>('save', async function(next: (err?: Error) => void): Promise<void> {
  try {
    if (!this.referralCode || !this.referralCode.length) {
      this.referralCode = await genUniqueReferralCode();
    }
    if (!this.isModified('password')) {
      return next();
    }
    const hash = await User.hashPassword(this.password);
    this.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
})
@modelOptions({ existingMongoose: mongoose, schemaOptions })
export class IUser extends BaseSchema {
  public static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  @prop({
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
    trim: true,
    lowercase: true,
    index: true,
    maxlength: 250,
  })
  public email: string;

  @prop({
    default: undefined,
    minlength: 6,
    maxlength: 128,
  })
  public password: string;

  @prop({
    required: true,
    maxlength: 50,
    default: '',
  })
  public firstName: string;

  @prop({
    required: true,
    maxlength: 50,
    default: '',
  })
  public lastName: string;

  get fullName(): string {
    return _.map([this.firstName, this.lastName], _.trim).join(' ');
  }

  @prop({
    maxlength: 50,
    default: undefined,
  })
  public avatarUrl?: string;

  @prop({
    default: false,
  })
  public isConfirmed: boolean;

  @prop()
  public pwChangedDate?: Date;

  @prop({
    enum: Roles,
    default: Roles.USER,
  })
  public role: string;

  @arrayProp({ items: String })
  public referrals: string[];

  @prop({ ref: IUser })
  public referrer: Ref<IUser>;

  @prop({
    unique: true,
    index: true,
  })
  public referralCode: string;

  public async comparePassword(this: DocumentType<IUser>, password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export const User = getModelForClass(IUser);

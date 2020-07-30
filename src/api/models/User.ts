import bcrypt from 'bcryptjs';
import * as _ from 'lodash';
import mongoose from 'mongoose';

import { arrayProp, DocumentType, getModelForClass, modelOptions, pre, prop, Ref } from '@typegoose/typegoose';

import { BaseSchema, defaultOptions, defaultSchemaOptions } from './BaseModel';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

export enum Roles {
  ADMIN = 'admin',
  CONTRIBUTOR = 'contributor',
  USER = 'user',
  APP = 'app',
}

export const ROLES_ALL = ['admin', 'contributor', 'user', 'app'];

const schemaOptions = Object.assign({}, defaultSchemaOptions, {
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

@pre<IUser>('save', async function (next: (err?: Error) => void): Promise<void> {
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
@modelOptions({ existingMongoose: mongoose, schemaOptions, options: defaultOptions })
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
  // class-validator check
  @IsEmail()
  @MaxLength(250)
  public email: string;

  @prop({
    default: undefined,
    minlength: 6,
    maxlength: 128,
  })
  @MinLength(6)
  @MaxLength(128)
  public password: string;

  @prop({
    required: true,
    maxlength: 50,
    minlength: 2,
    default: '',
  })
  @MinLength(2)
  @MaxLength(50)
  public firstName: string;

  @prop({
    required: true,
    maxlength: 50,
    minlength: 2,
    default: '',
  })
  @MinLength(2)
  @MaxLength(50)
  public lastName: string;

  get fullName(): string {
    return _.map([this.firstName, this.lastName], _.trim).join(' ');
  }

  @prop({
    maxlength: 128,
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

  @prop({
    unique: true,
    index: true,
    sparse: true, // unique if not null
  })
  public serviceUserId: string; // id for social service

  @prop()
  public service: string; // service

  @prop()
  public twoFATempSecret: string;

  @prop()
  public twoFASecret: string;

  @prop()
  public phone: string;

  @prop()
  public country: string;

  @prop()
  public city: string;

  @prop()
  public address: string;

  @prop({ default: false })
  public twoFAEnabled: boolean;

  public async comparePassword(this: DocumentType<IUser>, password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export const User = getModelForClass(IUser);

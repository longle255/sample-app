import { Types } from 'mongoose';
import { prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export abstract class BaseSchema extends Base {
  @prop({ required: true, default: true })
  public isActive?: boolean;

  @prop()
  public createdBy: Types.ObjectId;

  @prop()
  public updatedBy: Types.ObjectId;
}

export const defaultOptions = {
  validateBeforeSave: false,
  versionKey: '_v',
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  toJSON: {
    getters: true,
    virtuals: true,
    transform: (doc, ret, options) => {
      delete ret._id;
      return ret;
    },
  },
  toObject: {
    getters: true,
    virtuals: true,
  },
  usePushEach: true,
  autoIndex: true,
};

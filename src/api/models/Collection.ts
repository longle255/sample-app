import * as _ from 'lodash';
import mongoose from 'mongoose';
import { prop, getModelForClass, modelOptions, arrayProp } from '@typegoose/typegoose';
import { BaseSchema, defaultOptions } from './BaseModel';
import { env } from '../../env';

const schemaOptions = Object.assign({}, defaultOptions, {
  collection: 'collections',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret, options) => {
      ret.photos = ret.photos.map((p: any) => {
        p.uri = `${env.app.cdnUri}/${ret.uri}/${p.name}`;
        delete p.name;
        return p;
      });
      delete ret._id;
      ret.thumbnail = ret.photos[0];
      return ret;
    },
  },
});

@modelOptions({ existingMongoose: mongoose, schemaOptions })
export class ICollection extends BaseSchema {
  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public nativeName: string;

  @prop({ required: true })
  public description: string;

  @prop({ required: true })
  public thumbnail: string;

  @prop({ required: true })
  public uri: string;

  @prop({ required: true, default: 0 })
  public views: number;

  @prop({ required: true, default: 0 })
  public likes: number;

  @prop({ required: true })
  public tags: string[];

  @arrayProp({ required: true, _id: false, items: Object })
  public photos: object[];
}

export const Collection = getModelForClass(ICollection);

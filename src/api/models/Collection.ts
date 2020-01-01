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
      ret.photos = ret.photos.map(p => {
        delete p.name;

        p.uri = `${env.app.uri}/${ret.uri}/${p.uri}`;
        return p;
      });
      delete ret._id;
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
  @prop({ required: true })
  public viewed: number;

  @prop({ required: true })
  public liked: number;

  @prop({ required: true })
  public tags: string[];

  @arrayProp({ required: true, _id: false, items: Object })
  public photos: object[];

  get thumnailUrl(): string {
    return `${env.app.uri}/${this.uri}/${this.thumbnail}`;
  }

  get photosUrl(): string[] {
    return this.photos.map((photo: any) => `${env.app.uri}/${this.uri}/${photo.uri}`);
  }
}

export const Collection = getModelForClass(ICollection);

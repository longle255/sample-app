import * as _ from 'lodash';
import mongoose from 'mongoose';
import { prop, getModelForClass, modelOptions, arrayProp } from '@typegoose/typegoose';
// import slugify from 'slugify';
import { BaseSchema, defaultOptions } from './BaseModel';
import { env } from '../../env';

const schemaOptions = Object.assign(
  {},
  {
    collection: 'collections',
  },
  defaultOptions,
);

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
  public photos: string[];

  @arrayProp({ required: true, items: String })
  public tags: string[];

  get thumnailUrl(): string {
    return `${env.app.uri}/${this.uri}/${this.thumbnail}`;
  }

  get photosUrl(): string[] {
    return this.photos.map(photo => `${env.app.uri}/${this.uri}/${photo}`);
  }
}

export const Collection = getModelForClass(ICollection);

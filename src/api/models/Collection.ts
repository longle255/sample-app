import * as _ from 'lodash';
import mongoose from 'mongoose';
import { prop, getModelForClass, modelOptions, arrayProp, pre } from '@typegoose/typegoose';
import slugify from 'slugify';
import { BaseSchema, defaultOptions } from './BaseModel';

const schemaOptions = Object.assign(
  {},
  {
    collection: 'collections',
  },
  defaultOptions,
);

@pre<ICollection>('save', async function(next: (err?: Error) => void): Promise<void> {
  try {
    this.slug = slugify(this.name);
    return next();
  } catch (error) {
    return next(error);
  }
})
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
  public slug: string;
  @prop({ required: true })
  public photos: string[];
  @arrayProp({ required: true, items: String })
  public tags: string[];
}

export const Collection = getModelForClass(ICollection);

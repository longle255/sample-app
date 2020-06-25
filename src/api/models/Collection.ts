import * as _ from 'lodash';
import mongoose from 'mongoose';
import { DocumentType, prop, getModelForClass, modelOptions, arrayProp } from '@typegoose/typegoose';
import { BaseSchema, defaultSchemaOptions, defaultOptions } from './BaseModel';
import { env } from '../../env';

export class Photo {
  @prop()
  public name: string;
  @prop()
  public width: number;
  @prop()
  public height: number;
  @prop()
  public direction: string;

  constructor(name: string, width: number, height: number, direction: string) {
    this.name = name;
    this.width = width;
    this.height = height;
    this.direction = direction;
  }
}
const schemaOptions = Object.assign({}, defaultSchemaOptions, {
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

// tslint:disable-next-line: max-classes-per-file
@modelOptions({ existingMongoose: mongoose, schemaOptions, options: defaultOptions })
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

  @arrayProp({ required: true, _id: false, items: Photo })
  public photos: Photo[];

  public reduce(this: DocumentType<ICollection>, liked: boolean = false): any {
    const obj = this.toJSON();
    obj.photosCount = obj.photos.length;
    obj.photos = _.take(obj.photos, 5);
    obj.liked = liked;
    return obj;
  }
}

export const Collection = getModelForClass(ICollection);

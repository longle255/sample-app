import * as _ from 'lodash';
import mongoose from 'mongoose';
import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

import { BaseSchema, defaultOptions } from './BaseModel';

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
    public photos: string[];
    @prop({ required: true })
    public tags: string[];
}

export const Collection = getModelForClass(ICollection);

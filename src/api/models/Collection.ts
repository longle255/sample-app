import * as _ from 'lodash';
import mongoose from 'mongoose';
import { prop } from 'typegoose';

import { BaseSchema, defaultOptions } from './BaseModel';

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

const options = Object.assign(
    {},
    {
        collection: 'collections',
        autoIndex: true,
        timestamps: true,
    },
    defaultOptions,
);

export const Collection = new ICollection().getModelForClass(ICollection, {
    existingMongoose: mongoose,
    schemaOptions: options,
});

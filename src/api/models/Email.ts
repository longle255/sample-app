import * as _ from 'lodash';
import mongoose from 'mongoose';
import { prop, Ref } from 'typegoose';

import { BaseSchema, defaultOptions } from './BaseModel';
import { IUser } from './User';

export class IEmail extends BaseSchema {
    @prop({ ref: IUser, required: false })
    public user: Ref<IUser>;

    @prop({ required: true})
    public email: string;

    @prop({ required: true})
    public template: string;

    @prop({ required: true })
    public payload: object;

}

const options = Object.assign(
    {},
    {
        collection: 'emails',
        autoIndex: true,
        timestamps: true,
    },
    defaultOptions,
);

export const Email = new IEmail().getModelForClass(IEmail, {
    existingMongoose: mongoose,
    schemaOptions: options,
});

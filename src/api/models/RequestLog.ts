import * as _ from 'lodash';
import mongoose from 'mongoose';
import { prop, Ref } from 'typegoose';

import { BaseSchema, defaultOptions } from './BaseModel';
import { IUser } from './User';

export class IRequestLog extends BaseSchema {
    @prop({ ref: IUser, required: false })
    public user: Ref<IUser>;
    @prop()
    public path: string;
    @prop()
    public method: string;
    @prop()
    public ip: string;
    @prop()
    public headers: object;
    @prop()
    public query: object;
    @prop()
    public body: object;
    @prop()
    public resCode: number;
    @prop()
    public resBody: string;
    @prop()
    public resTime: number;
}

const options = Object.assign(
    {},
    {
        collection: 'request-logs',
        autoIndex: true,
        timestamps: true,
    },
    defaultOptions,
);

export const RequestLog = new IRequestLog().getModelForClass(IRequestLog, {
    existingMongoose: mongoose,
    schemaOptions: options,
});

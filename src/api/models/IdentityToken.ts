import * as _ from 'lodash';
import mongoose from 'mongoose';
import { prop, Ref } from 'typegoose';

import { BaseSchema, defaultOptions } from './BaseModel';
import { IUser } from './User';

export enum TokenTypes {
    'reset-password', 'refresh-token', 'email-confirmation',
}

export class IIdentityToken extends BaseSchema {

    @prop({  required: true, index: true })
    public token: string;

    @prop({ ref: IUser, required: true })
    public user: Ref<IUser>;

    @prop({ required: true })
    public email: string;

    @prop()
    public expires: Date;

    @prop({
        enum: TokenTypes,
        default: TokenTypes['refresh-token'],
    })
    public type: string;
}

const options = Object.assign(
    {},
    {
        collection: 'identity-tokens',
        autoIndex: true,
        timestamps: true,
    },
    defaultOptions,
);

export const IdentityToken = new IIdentityToken().getModelForClass(IIdentityToken, {
    existingMongoose: mongoose,
    schemaOptions: options,
});

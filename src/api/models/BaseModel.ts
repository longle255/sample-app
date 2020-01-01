import { ObjectId } from 'mongodb';
import { prop } from '@typegoose/typegoose';

export abstract class BaseSchema {
    @prop({ required: true, default: true })
    public isActive?: boolean;

    @prop()
    public createdBy: ObjectId;

    @prop()
    public updatedBy: ObjectId;
}

export const defaultOptions = {
    validateBeforeSave: false,
    versionKey: '_v',
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    },
    toJSON: {
        getters: true,
        virtuals: true,
    },
    toObject: {
        getters: true,
        virtuals: true,
    },
    usePushEach: true,
    autoIndex: true,
};

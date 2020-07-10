import { SchemaOptions, Types } from 'mongoose';

import { prop, Severity } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ICustomOptions } from '@typegoose/typegoose/lib/types';

export abstract class BaseSchema extends Base {
	@prop({ required: true, default: true })
	public isActive?: boolean;

	@prop()
	public createdBy: Types.ObjectId;

	@prop()
	public updatedBy: Types.ObjectId;
}

export const defaultSchemaOptions: SchemaOptions = {
	validateBeforeSave: false,
	versionKey: '_v',
	timestamps: {
		createdAt: 'createdAt',
		updatedAt: 'updatedAt',
	},
	toJSON: {
		getters: true,
		virtuals: true,
		transform: (_doc, ret) => {
			delete ret._id;
			return ret;
		},
	},
	toObject: {
		getters: true,
		virtuals: true,
	},
	usePushEach: true,
	autoIndex: true,
};

export const defaultOptions: ICustomOptions = {
	allowMixed: Severity.ALLOW,
};

import _ from 'lodash';
import { Service } from 'typedi';
import { BadRequestError } from 'routing-controllers';
import { DocumentType } from '@typegoose/typegoose';
import { UpdateQuery } from 'mongoose';
import { Logger } from '../../lib/logger';
import { BaseService } from './BaseService';
import { Like, ILike, IUser, ICollection, Collection } from '../models';
import { PaginationOptionsInterface, Pagination, defaultOption } from './Pagination';

@Service()
export class CollectionService extends BaseService<ICollection> {
	constructor() {
		super(new Logger(__filename), Collection);
	}

	public async getAll(user: DocumentType<IUser>, options: PaginationOptionsInterface): Promise<Pagination<ICollection>> {
		options = _.defaultsDeep({}, options, defaultOption);
		const ret: any = await this.model.aggregate([
			{ $match: options.cond },
			{ $sort: options.sort },
			{
				$facet: {
					paging: [{ $count: 'total' }, { $addFields: { page: options.pageNumber, limit: options.pageSize } }],
					results: [{ $skip: options.pageNumber * options.pageSize }, { $limit: options.pageSize }], // add projection here wish you re-shape the docs
				},
			},
		]);
		if (!ret.length) {
			return new Pagination<ICollection>({
				total: 0,
				pagesCount: 0,
				pageNumber: 0,
				pageSize: options.pageSize,
				data: [],
			});
		}
		const liked = (await Like.find({ user, isActive: true })).map((like: any) => like.coll._id.toString());
		const data = ret[0].results.map((coll: DocumentType<ICollection>) =>
			new this.model(coll).reduce(liked.indexOf(coll._id.toHexString()) >= 0),
		);
		return new Pagination<ICollection>({
			total: ret[0].paging[0].total,
			pagesCount: Math.ceil(ret[0].paging[0].total / options.pageSize),
			pageNumber: ret[0].paging[0].page,
			pageSize: options.pageSize,
			data,
		});
	}

	public async getLikes(user: DocumentType<IUser>, options: PaginationOptionsInterface): Promise<Pagination<ICollection>> {
		options = Object.assign({}, defaultOption, options);
		const total = await Like.count({ user, isActive: true });
		const pageCount = Math.ceil(total / options.pageSize);
		const pageNumber = options.pageNumber;
		const likes = await Like.find({ user, isActive: true })
			.skip(options.pageNumber * options.pageSize)
			.limit(options.pageSize)
			.populate('coll');
		const data: any = likes.map((like: any) => like.coll).map((coll) => coll.reduce(true));
		return new Pagination<ICollection>({
			data,
			total,
			pagesCount: pageCount,
			pageNumber,
			pageSize: options.pageSize,
		});
	}

	public async findOneAndIncreaseView(user: DocumentType<IUser>, colId: string): Promise<ICollection | undefined> {
		this.log.debug(`Find one ${this.model.modelName} ${colId} and increase view for user ${JSON.stringify(user)}`);
		const update = { $inc: { views: 1 } } as UpdateQuery<ICollection>;
		const result = await this.model.findOneAndUpdate({ _id: colId }, update, { new: true });
		const liked = await Like.findOne({ coll: colId, user, isActive: true });
		const obj = result.toJSON();
		obj.photosCount = obj.photos.length;
		obj.liked = !_.isNil(liked);
		return obj;
	}

	public async like(user: DocumentType<IUser>, colId: string): Promise<ICollection | undefined> {
		this.log.debug(`Like one ${this.model.modelName} for user ${JSON.stringify(user)}`);
		const like: ILike = await Like.findOne({ coll: colId, user: user._id, isActive: true });
		if (like) {
			throw new BadRequestError('Already like this collection');
		}
		const update = { $inc: { likes: 1 } } as UpdateQuery<ICollection>;
		let coll = await this.model.findOneAndUpdate({ _id: colId }, update, { new: true });
		if (!coll) {
			return coll;
		}
		await Like.findOneAndUpdate(
			{ coll: colId, user: user._id },
			{
				coll,
				user,
				isActive: true,
			},
			{ upsert: true },
		);
		coll = coll.reduce(true);
		return coll;
	}

	public async unlike(user: DocumentType<IUser>, colId: string): Promise<ICollection | undefined> {
		this.log.debug(`Unlike one ${this.model.modelName} for user ${JSON.stringify(user)}`);
		const like = await Like.findOne({ coll: colId, user: user._id, isActive: true });
		if (!like) {
			throw new BadRequestError('Have not liked this collection');
		}
		const update = { $inc: { likes: -1 } } as UpdateQuery<ICollection>;
		let coll = await this.model.findOneAndUpdate({ _id: colId }, update, { new: true });
		if (!coll) {
			return coll;
		}
		await Like.findOneAndUpdate(
			{ coll: colId, user: user._id },
			{
				coll,
				user,
				isActive: false,
			},
			{ upsert: false },
		);
		coll = coll.reduce(false);
		return coll;
	}
}

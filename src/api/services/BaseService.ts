import { EventDispatcher } from 'event-dispatch';
import createHttpError from 'http-errors';
import _ from 'lodash';
import { Model as BaseModel } from 'mongoose';
import { Service } from 'typedi';

import { DocumentType } from '@typegoose/typegoose';

import { LoggerInterface } from '../../decorators/Logger';
import { BaseSchema } from '../models/BaseModel';
import { events } from '../subscribers/events';
import { defaultOption, Pagination, PaginationOptionsInterface } from './Pagination';

@Service()
export abstract class BaseService<E extends BaseSchema> {
	public model: BaseModel<any, any>;
	protected log: LoggerInterface;
	private eventDispatcher: EventDispatcher;

	constructor(log: LoggerInterface, model: BaseModel<any, any>) {
		this.log = log;
		this.model = model;
		this.eventDispatcher = new EventDispatcher();
	}

	public async paginate(options: PaginationOptionsInterface): Promise<Pagination<E>> {
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
		if (!ret.length || !ret[0].paging?.length) {
			return new Pagination<E>({
				total: 0,
				pagesCount: 0,
				pageNumber: 0,
				pageSize: options.pageSize,
				data: [],
			});
		}
		return new Pagination<E>({
			total: ret[0].paging[0].total,
			pagesCount: Math.ceil(ret[0].paging[0].total / options.pageSize),
			pageNumber: ret[0].paging[0].page,
			pageSize: options.pageSize,
			data: ret[0].results.map((d) => new this.model(d).toJSON()),
		});
	}

	public async find(cond?: object): Promise<Array<DocumentType<E>>> {
		this.log.verbose(`Find all ${this.model.modelName}`);
		return this.model.find(cond);
	}

	public async findOne(cond: object): Promise<DocumentType<E> | undefined> {
		this.log.verbose(`Find one ${this.model.modelName} with condition ${cond}`);
		return this.model.findOne(cond);
	}

	public findOneAndRemove(cond: object): Promise<DocumentType<E> | undefined> {
		this.log.debug(`Find one ${this.model.modelName} and remove with condition ${JSON.stringify(cond)}`);
		return this.model.findOneAndRemove(cond);
	}

	public async create(instant: E): Promise<DocumentType<E>> {
		this.log.verbose(`Create a new ${this.model.modelName} => `, JSON.stringify(instant));
		try {
			const result = await this.model.create(instant);
			if (events[this.model.modelName]) {
				this.eventDispatcher.dispatch(events[this.model.modelName].created, result);
			}
			return result;
		} catch (err) {
			if (err.name === 'MongoError' && err.code === 11000) {
				throw createHttpError(409, 'Duplicate key');
			}
			throw err;
		}
	}

	public update(id: any, body: any): Promise<DocumentType<E>> {
		this.log.verbose(`Update an ${this.model.modelName}`);
		const updateData = _.omit(body, ['id']);
		return this.model
			.findOneAndUpdate({ _id: id }, updateData, { new: true, select: {} })
			.then((result: DocumentType<E>) => {
				return result;
			})
			.catch((err: any) => {
				throw err;
			});
	}

	public async delete(id: any): Promise<void> {
		this.log.verbose(`Delete an ${this.model.modelName}`);
		return this.model
			.findByIdAndRemove({ _id: id })
			.then(() => {
				return;
			})
			.catch((err: any) => {
				throw err;
			});
	}
}

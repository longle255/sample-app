import createHttpError from 'http-errors';
import _ from 'lodash';
import { Service } from 'typedi';
import { InstanceType } from 'typegoose';
import { LoggerInterface } from '../../decorators/Logger';
import { Model as BaseModel } from 'mongoose';
import { BaseSchema } from '../models/BaseModel';
import { EventDispatcher } from 'event-dispatch';
import { events } from '../subscribers/events';

@Service()
export abstract class BaseService<E extends BaseSchema> {
    protected log: LoggerInterface;
    private model: BaseModel<any, any>;
    private eventDispatcher: EventDispatcher;

    constructor(log: LoggerInterface, model: BaseModel<any, any>) {
        this.log = log;
        this.model = model;
        this.eventDispatcher = new EventDispatcher();
    }

    public find(cond?: object): Promise<Array<InstanceType<E>>> {
        this.log.debug(`Find all ${this.model.modelName}`);
        return new Promise<Array<InstanceType<E>>>(async (resolve, reject) => {
            try {
                const result = await this.model.find(cond);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    }

    public findOne(cond: object): Promise<InstanceType<E> | undefined> {
        this.log.debug(`Find one ${this.model.modelName} with condition ${cond}`);
        return new Promise<InstanceType<E>>(async (resolve, reject) => {
            try {
                const result = await this.model.findOne(cond);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    }

    public async create(instant: E): Promise<InstanceType<E>> {
        this.log.debug(`Create a new ${this.model.modelName} => `, JSON.stringify(instant));
        return new Promise<InstanceType<E>>(async (resolve, reject) => {
            try {
                const result = await this.model.create(instant);
                if (events[this.model.modelName]) {
                    this.eventDispatcher.dispatch(events[this.model.modelName].created, result);
                }
                resolve(result);
            } catch (err) {
                if (err.name === 'MongoError' && err.code === 11000) {
                    return reject(createHttpError(409, 'Duplicate key'));
                }
                reject(err);
            }
        });
    }

    public update(id: any, body: any): Promise<InstanceType<E>> {
        this.log.debug(`Update an ${this.model.modelName}`);
        return new Promise<InstanceType<E>>(async (resolve, reject) => {
            const updateData = _.omit(body, ['id']);
            return this.model
                .findOneAndUpdate({ _id: id }, updateData, { new: true, select: {} })
                .then((result: InstanceType<E>) => {
                    resolve(result);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    public async delete(id: any): Promise<void> {
        this.log.debug(`Delete an ${this.model.modelName}`);
        return new Promise<void>(async (resolve, reject) => {
            return this.model
                .findByIdAndRemove({ _id: id })
                .then((result: E) => {
                    resolve();
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

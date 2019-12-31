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
export abstract class BaseService<ISchema extends BaseSchema> {
    protected log: LoggerInterface;
    private model: BaseModel<any, any>;
    private modelName: string;
    private eventDispatcher: EventDispatcher;

    constructor(log: LoggerInterface, model: BaseModel<any, any>, modelName: string) {
        this.log = log;
        this.model = model;
        this.modelName = modelName;
        this.eventDispatcher = new EventDispatcher();
    }

    public find(cond?: object): Promise<Array<InstanceType<ISchema>>> {
        this.log.debug(`Find all ${this.modelName}`);
        return new Promise<Array<InstanceType<ISchema>>>(async (resolve, reject) => {
            try {
                const result = await this.model.find(cond);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    }

    public findOne(cond: object): Promise<InstanceType<ISchema> | undefined> {
        this.log.debug(`Find one ${this.modelName} with condition %s`, cond);
        return new Promise<InstanceType<ISchema>>(async (resolve, reject) => {
            try {
                const result = await this.model.findOne(cond);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    }

    public async create(instant: ISchema): Promise<InstanceType<ISchema>> {
        this.log.debug(`Create a new ${this.modelName} => `, instant.toString());
        return new Promise<InstanceType<ISchema>>(async (resolve, reject) => {
            try {
                const result = await this.model.create(instant);
                if (events[this.modelName]) {
                    this.eventDispatcher.dispatch(events[this.modelName].created, result);
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

    public update(id: any, body: any): Promise<InstanceType<ISchema>> {
        this.log.debug(`Update an ${this.modelName}`);
        return new Promise<InstanceType<ISchema>>(async (resolve, reject) => {
            const updateData = _.omit(body, ['id']);
            return this.model
                .findOneAndUpdate({ _id: id }, updateData, { new: true, select: {} })
                .then((result: InstanceType<ISchema>) => {
                    resolve(result);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    public async delete(id: any): Promise<void> {
        this.log.debug(`Delete an ${this.modelName}`);
        return new Promise<void>(async (resolve, reject) => {
            return this.model
                .findByIdAndRemove({ _id: id })
                .then((result: ISchema) => {
                    resolve();
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}

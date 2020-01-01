import * as _ from 'lodash';
import { Service } from 'typedi';
import { Logger } from '../../lib/logger';
import { BaseService } from './BaseService';
import { ICollection, Collection } from '../models/Collection';

@Service()
export class CollectionService extends BaseService<ICollection> {
    constructor() {
        super(new Logger(__filename), Collection);
    }
}

import _ from 'lodash';
import Container, { Service } from 'typedi';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import Exchange from '../../lib/exchange';

@Service()
export class ExchangeService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        private exchange: Exchange = Container.get<Exchange>(Exchange),
    ) { }

    public test(): void {
        this.log.info('%s', this.exchange.getAll());
    }
}

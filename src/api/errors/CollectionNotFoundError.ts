import { HttpError } from 'routing-controllers';

export class CollectionNotFoundError extends HttpError {
    constructor() {
        super(404, 'Collection not found!');
    }
}

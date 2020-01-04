import { NotFoundError } from 'routing-controllers';

export class RecordNotFoundError extends NotFoundError {
  constructor() {
    super('Record not found!');
  }
}

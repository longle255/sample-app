import { HttpError } from 'routing-controllers';

export class RecordNotFoundError extends HttpError {
  constructor() {
    super(404, 'Record not found!');
  }
}

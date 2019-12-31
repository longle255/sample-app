import { HttpError } from 'routing-controllers';

export class InvalidCaptchaError extends HttpError {
    public errors: any;
    constructor(message?: string, errors?: any) {
        super(400, message || 'Bad request!');
        this.errors = errors;
    }
}

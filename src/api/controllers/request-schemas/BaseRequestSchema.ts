import { classToPlain } from 'class-transformer';
import { validate, ValidatorOptions } from 'class-validator';

import { ValidateResult } from '../../validators/ValidateResult';

const validatorOptions: ValidatorOptions = {
    skipMissingProperties: false,
    validationError: {
        target: false,
    },
};

export abstract class BaseRequestSchema {
    protected data?: any;

    public async validate?(): Promise<ValidateResult> {
        const errors = await validate(this, validatorOptions);
        const isValid = errors.length === 0;
        const result = new ValidateResult(isValid, errors);
        return result;
    }

    public toObject?(): any {
        return classToPlain(this, { excludePrefixes: ['_'] });
    }
}

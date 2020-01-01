import { ValidationError } from 'class-validator';

export class ValidateResult {
  public valid = false;
  public error: any;

  constructor(valid: boolean, errors: ValidationError[]) {
    this.valid = valid;

    if (!valid) {
      const error: any = {};

      errors.forEach(err => {
        error[err.property] = Object.keys(err.constraints).map(x => err.constraints[x]);
      });

      this.error = error;
    }
  }
}

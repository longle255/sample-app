export class FormHelper {
  static getFormGroupClasses(
    state: any,
    form,
    fieldName: string,
    defaultClasses = 'ant-form-item-control',
  ): string {
    const { hasSubmited, isProcessing } = state;
    const { isFieldTouched } = form;

    if (!hasSubmited || (isFieldTouched && !isFieldTouched(fieldName))) {
      return defaultClasses;
    }

    if (form.getFieldError[fieldName]) {
      return `${defaultClasses} has-error`;
    }

    return `${defaultClasses} has-success`;
  }

  static setFormError(form: any, errorInfo: any) {
    const { errors } = errorInfo;

    Object.keys(errors).forEach(key => {
      form.setFields({
        [key]: {
          value: form.getFieldValue(key),
          errors: errors[key].map(x => new Error(x)),
        },
      });
    });
  }

  static compareToFirstPassword(options) {
    const { fieldName, rule, value, callback, form, state } = options;

    if (value && value !== form.getFieldValue(fieldName)) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
}

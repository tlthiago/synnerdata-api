import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (value === null || value === undefined) {
            return true;
          }

          const inputDate = new Date(value as string);
          if (isNaN(inputDate.getTime())) {
            return true;
          }

          inputDate.setUTCHours(0, 0, 0, 0);
          const today = new Date();
          today.setUTCHours(0, 0, 0, 0);

          return inputDate <= today;
        },
        defaultMessage() {
          return 'A data não pode ser superior à data de hoje.';
        },
      },
    });
  };
}

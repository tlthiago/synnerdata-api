import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsFlexibleDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isFlexibleDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value || typeof value !== 'string') {
            return false;
          }

          const cleanValue = value.trim();

          const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

          const yyyymmddRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;

          let day: number, month: number, year: number;

          if (ddmmyyyyRegex.test(cleanValue)) {
            const match = cleanValue.match(ddmmyyyyRegex);
            day = parseInt(match[1], 10);
            month = parseInt(match[2], 10);
            year = parseInt(match[3], 10);
          } else if (yyyymmddRegex.test(cleanValue)) {
            const match = cleanValue.match(yyyymmddRegex);
            year = parseInt(match[1], 10);
            month = parseInt(match[2], 10);
            day = parseInt(match[3], 10);
          } else {
            return false;
          }

          if (year < 1900 || year > new Date().getFullYear()) {
            return false;
          }

          if (month < 1 || month > 12) {
            return false;
          }

          const daysInMonth = new Date(year, month, 0).getDate();
          if (day < 1 || day > daysInMonth) {
            return false;
          }

          const testDate = new Date(year, month - 1, day);
          return (
            testDate.getFullYear() === year &&
            testDate.getMonth() === month - 1 &&
            testDate.getDate() === day
          );
        },
        defaultMessage() {
          return 'Data deve estar no formato DD/MM/YYYY ou YYYY-MM-DD e ser uma data válida';
        },
      },
    });
  };
}

import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'atLeastOne', async: false })
class AtLeastOne implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments) {
    const fieldsToCheck = args.constraints as string[];
    const object = args.object as Record<string, unknown>;

    return fieldsToCheck.some((field) => !!object[field]); // Returns true if at least one is present
  }

  defaultMessage(args: ValidationArguments) {
    return `At least one of ${args.constraints.join(', ')} must be provided`;
  }
}

export function AtLeastOneField(...fields: string[]) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOne',
      target: object.constructor,
      propertyName,
      options: {
        message: `At least one of ${fields.join(', ')} must be provided`,
      },
      constraints: fields,
      validator: AtLeastOne,
    });
  };
}

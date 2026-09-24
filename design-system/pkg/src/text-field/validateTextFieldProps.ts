import { FieldProps, validateFieldProps } from '@orclickag/keystatic-ui/field';

export function validateTextFieldProps<T extends FieldProps>(props: T): T {
  return validateFieldProps(props);
}

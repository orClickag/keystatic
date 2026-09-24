import { NumberField } from '@orclickag/keystatic-ui/number-field';
import { useReducer } from 'react';
import { validateInteger } from './validateInteger';
import { FormFieldInputProps } from '../../api';
import { useFieldSpan } from '../context';

export function IntegerFieldInput(
  props: FormFieldInputProps<number | null> & {
    label: string;
    description: string | undefined;
    validation:
      | { isRequired?: boolean; min?: number; max?: number }
      | undefined;
  }
) {
  const [blurred, onBlur] = useReducer(() => true, false);
  const fieldSpan = useFieldSpan();

  return (
    <NumberField
      label={props.label}
      description={props.description}
      isRequired={props.validation?.isRequired}
      errorMessage={
        props.forceValidation || blurred
          ? validateInteger(props.validation, props.value, props.label)
          : undefined
      }
      onBlur={onBlur}
      autoFocus={props.autoFocus}
      width={fieldSpan < 12 ? '100%' : undefined}
      value={props.value === null ? undefined : props.value}
      onChange={val => {
        props.onChange((val === undefined ? null : val) as any);
      }}
    />
  );
}

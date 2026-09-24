import { NumberField } from '@orclickag/keystatic-ui/number-field';
import { useReducer } from 'react';
import { validateNumber } from './validateNumber';
import { FormFieldInputProps } from '../../api';
import { useFieldSpan } from '../context';

export function NumberFieldInput(
  props: FormFieldInputProps<number | null> & {
    label: string;
    description: string | undefined;
    step: number | undefined;
    validation:
      | { isRequired?: boolean; min?: number; max?: number; step?: boolean }
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
          ? validateNumber(
              props.validation,
              props.value,
              props.step,
              props.label
            )
          : undefined
      }
      onBlur={onBlur}
      autoFocus={props.autoFocus}
      width={fieldSpan < 12 ? '100%' : undefined}
      step={props.step}
      value={props.value === null ? undefined : props.value}
      onChange={val => {
        props.onChange((val === undefined ? null : val) as any);
      }}
    />
  );
}

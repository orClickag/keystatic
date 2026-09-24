import { FormFieldInputProps } from '../../api';
import { Checkbox } from '@orclickag/keystatic-ui/checkbox';
import { Text } from '@orclickag/keystatic-ui/typography';

export function CheckboxFieldInput(
  props: FormFieldInputProps<boolean> & {
    label: string;
    description?: string;
  }
) {
  return (
    <Checkbox
      isSelected={props.value}
      onChange={props.onChange}
      autoFocus={props.autoFocus}
    >
      <Text>{props.label}</Text>
      {props.description && <Text slot="description">{props.description}</Text>}
    </Checkbox>
  );
}

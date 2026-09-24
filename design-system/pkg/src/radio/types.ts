import { AriaRadioGroupProps, AriaRadioProps } from 'react-aria/useRadioGroup';
import { ReactNode } from 'react';

import { FieldProps } from '@orclickag/keystatic-ui/field';
import { BaseStyleProps } from '@orclickag/keystatic-ui/style';

export type RadioProps = AriaRadioProps & BaseStyleProps;

export type RadioGroupProps = AriaRadioGroupProps &
  FieldProps &
  BaseStyleProps & {
    /** The radio buttons contained within the group. */
    children: ReactNode;
  };

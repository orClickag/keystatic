import { useLocalizedStringFormatter } from 'react-aria/useLocalizedStringFormatter';
import { mergeProps } from 'react-aria/mergeProps';
import { useLabels } from 'react-aria/private/utils/useLabels';
import {
  ForwardRefExoticComponent,
  ForwardedRef,
  Ref,
  forwardRef,
} from 'react';

import { ActionButton } from '@orclickag/keystatic-ui/button';
import { Dialog, DialogTrigger } from '@orclickag/keystatic-ui/dialog';
import { Icon } from '@orclickag/keystatic-ui/icon';
import { helpCircleIcon } from '@orclickag/keystatic-ui/icon/icons/helpCircleIcon';
import { infoIcon } from '@orclickag/keystatic-ui/icon/icons/infoIcon';
import { ClearSlots } from '@orclickag/keystatic-ui/slots';
import { classNames, css, tokenSchema } from '@orclickag/keystatic-ui/style';

import localizedMessages from './l10n';
import { ContextualHelpProps } from './types';

/** Contextual help shows a user extra information about an adjacent component. */
export const ContextualHelp: ForwardRefExoticComponent<
  ContextualHelpProps & { ref?: Ref<HTMLButtonElement> }
> = forwardRef(function ContextualHelp(
  props: ContextualHelpProps,
  ref: ForwardedRef<HTMLButtonElement>
) {
  let { children, variant = 'help', ...otherProps } = props;

  let stringFormatter = useLocalizedStringFormatter(localizedMessages);
  let labelProps = useLabels(otherProps, stringFormatter.format(variant));

  let icon = variant === 'info' ? infoIcon : helpCircleIcon;

  return (
    <DialogTrigger {...otherProps} type="popover">
      <ActionButton
        {...mergeProps(otherProps, labelProps, { isDisabled: false })}
        ref={ref}
        UNSAFE_className={classNames(
          css({
            borderRadius: tokenSchema.size.radius.small,
            height: tokenSchema.size.element.small,
            minWidth: 'unset',
            paddingInline: 0,
            width: tokenSchema.size.element.small,
          }),
          otherProps.UNSAFE_className
        )}
        prominence="low"
      >
        <Icon src={icon} />
      </ActionButton>
      <ClearSlots>
        <Dialog>{children}</Dialog>
      </ClearSlots>
    </DialogTrigger>
  );
});

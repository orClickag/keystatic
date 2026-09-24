import { filterDOMProps } from 'react-aria/filterDOMProps';
import { DOMProps } from '@react-types/shared';
import { ReactNode } from 'react';

import { BaseStyleProps, useStyleProps } from '@orclickag/keystatic-ui/style';
import { forwardRefWithAs } from '@orclickag/keystatic-ui/utils/ts';

import { ClearSlots, useSlotProps } from './context';

type ContentProps = {
  /**
   * The content element(s).
   */
  children: ReactNode;
} & BaseStyleProps &
  DOMProps;

/** A block of content within a container. */
export const Content = forwardRefWithAs<ContentProps, 'section'>(
  (props, ref) => {
    props = useSlotProps(props, 'content');
    let { elementType: Element = 'section', children, ...otherProps } = props;
    let styleProps = useStyleProps(otherProps);

    return (
      <Element {...filterDOMProps(otherProps)} {...styleProps} ref={ref}>
        <ClearSlots>{children}</ClearSlots>
      </Element>
    );
  }
);

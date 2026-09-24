import { useMemo } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';

import { ActionButton } from '@orclickag/keystatic-ui/button';
import { quoteIcon } from '@orclickag/keystatic-ui/icon/icons/quoteIcon';
import { Icon } from '@orclickag/keystatic-ui/icon';
import { TooltipTrigger, Tooltip } from '@orclickag/keystatic-ui/tooltip';
import { Kbd, Text } from '@orclickag/keystatic-ui/typography';

import { useToolbarState } from '../toolbar-state';
import { isElementActive } from '../utils';

export const insertBlockquote = (editor: Editor) => {
  const isActive = isElementActive(editor, 'blockquote');
  if (isActive) {
    Transforms.unwrapNodes(editor, {
      match: node => node.type === 'blockquote',
    });
  } else {
    Transforms.wrapNodes(editor, {
      type: 'blockquote',
      children: [],
    });
  }
};

export const BlockquoteElement = ({
  attributes,
  children,
}: RenderElementProps) => {
  return <blockquote {...attributes}>{children}</blockquote>;
};

const BlockquoteButton = () => {
  const {
    editor,
    blockquote: { isDisabled, isSelected },
  } = useToolbarState();
  return useMemo(
    () => (
      <ActionButton
        prominence="low"
        isSelected={isSelected}
        isDisabled={isDisabled}
        onPress={() => {
          insertBlockquote(editor);
          ReactEditor.focus(editor);
        }}
      >
        <Icon src={quoteIcon} />
      </ActionButton>
    ),
    [editor, isDisabled, isSelected]
  );
};
export const blockquoteButton = (
  <TooltipTrigger>
    <BlockquoteButton />
    <Tooltip>
      <Text>Quote</Text>
      <Kbd>{'>⎵'}</Kbd>
    </Tooltip>
  </TooltipTrigger>
);

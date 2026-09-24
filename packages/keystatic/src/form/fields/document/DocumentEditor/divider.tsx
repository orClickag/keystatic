import { useMemo } from 'react';
import { Editor } from 'slate';
import { RenderElementProps, useSelected } from 'slate-react';

import { ActionButton } from '@orclickag/keystatic-ui/button';
import { tokenSchema } from '@orclickag/keystatic-ui/style';
import { Tooltip, TooltipTrigger } from '@orclickag/keystatic-ui/tooltip';
import { Text, Kbd } from '@orclickag/keystatic-ui/typography';

import { useToolbarState } from './toolbar-state';
import { insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading } from './ui-utils';
import { Icon } from '@orclickag/keystatic-ui/icon';
import { minusIcon } from '@orclickag/keystatic-ui/icon/icons/minusIcon';

export function insertDivider(editor: Editor) {
  insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
    type: 'divider',
    children: [{ text: '' }],
  });
  Editor.insertNode(editor, { type: 'paragraph', children: [{ text: '' }] });
}

const DividerButton = () => {
  const {
    editor,
    dividers: { isDisabled },
  } = useToolbarState();
  return useMemo(
    () => (
      <ActionButton
        prominence="low"
        isDisabled={isDisabled}
        onPress={() => {
          insertDivider(editor);
        }}
      >
        <Icon src={minusIcon} />
      </ActionButton>
    ),
    [editor, isDisabled]
  );
};

export const dividerButton = (
  <TooltipTrigger delay={200}>
    <DividerButton />
    <Tooltip>
      <Text>Divider</Text>
      <Kbd>---</Kbd>
    </Tooltip>
  </TooltipTrigger>
);

export function DividerElement({ attributes, children }: RenderElementProps) {
  const selected = useSelected();
  return (
    <div {...attributes} style={{ caretColor: 'transparent' }}>
      <hr
        style={{
          backgroundColor: selected
            ? tokenSchema.color.alias.borderSelected
            : tokenSchema.color.alias.borderIdle,
        }}
      />
      {children}
    </div>
  );
}

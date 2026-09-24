'use client';

import { ActionButton } from '@orclickag/keystatic-ui/button';
import { monitorIcon } from '@orclickag/keystatic-ui/icon/icons/monitorIcon';
import { moonIcon } from '@orclickag/keystatic-ui/icon/icons/moonIcon';
import { sunIcon } from '@orclickag/keystatic-ui/icon/icons/sunIcon';
import { Icon } from '@orclickag/keystatic-ui/icon';
import { MenuTrigger, Menu, Item } from '@orclickag/keystatic-ui/menu';
import { useRootColorScheme } from '@orclickag/keystatic-ui/next';

import { SCHEME_AUTO, SCHEME_DARK, SCHEME_LIGHT } from '@orclickag/keystatic-ui/primitives';
import { css } from '@orclickag/keystatic-ui/style';
import { ColorScheme } from '@orclickag/keystatic-ui/types';
import { Text } from '@orclickag/keystatic-ui/typography';

const items = [
  { icon: sunIcon, label: 'Light', key: 'light' },
  { icon: moonIcon, label: 'Dark', key: 'dark' },
  { icon: monitorIcon, label: 'System', key: 'auto' },
] as const;

export function ColorSchemeMenu() {
  let { colorScheme, setColorScheme } = useRootColorScheme();
  let hideWhenLight = css({
    [`.${SCHEME_LIGHT} &`]: { display: 'none' },
    [`.${SCHEME_AUTO} &`]: {
      '@media (prefers-color-scheme: light)': { display: 'none' },
    },
  });
  let hideWhenDark = css({
    [`.${SCHEME_DARK} &`]: { display: 'none' },
    [`.${SCHEME_AUTO} &`]: {
      '@media (prefers-color-scheme: dark)': { display: 'none' },
    },
  });

  return (
    <MenuTrigger>
      <ActionButton aria-label="Theme" prominence="low">
        <Icon src={moonIcon} UNSAFE_className={hideWhenLight} />
        <Icon src={sunIcon} UNSAFE_className={hideWhenDark} />
      </ActionButton>
      <Menu
        items={items}
        onSelectionChange={([key]) => setColorScheme(key as ColorScheme)}
        disallowEmptySelection
        selectedKeys={[colorScheme]}
        selectionMode="single"
      >
        {item => (
          <Item key={item.key} textValue={item.label}>
            <Icon src={item.icon} />
            <Text>{item.label}</Text>
          </Item>
        )}
      </Menu>
    </MenuTrigger>
  );
}

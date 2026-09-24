import { bookIcon } from '@orclickag/keystatic-ui/icon/icons/bookIcon';
import { githubIcon } from '@orclickag/keystatic-ui/icon/icons/githubIcon';
import { Icon } from '@orclickag/keystatic-ui/icon';
import { Divider } from '@orclickag/keystatic-ui/layout';
import { NavGroup, NavItem, NavList } from '@orclickag/keystatic-ui/nav-list';
import { Text } from '@orclickag/keystatic-ui/typography';

import { SidebarItem } from './types';
import { usePathname } from 'next/navigation';

/** Render nav items and groups of nav items. */
export const NavItems = ({ items }: { items: SidebarItem[] }) => {
  const pathname = usePathname();
  if (!pathname) {
    throw new Error('Missing pathname');
  }
  return (
    <NavList>
      {recursiveItems(items, pathname)}

      <Divider />
      <NavGroup title="Resources">
        <NavItem href="https://github.com/Thinkmill/keystatic/tree/main/design-system">
          <Icon src={githubIcon} />
          <Text>KeystarUI on GitHub</Text>
        </NavItem>
        <NavItem href="https://keystatic.com/">
          <Icon src={bookIcon} />
          <Text>Keystatic Docs</Text>
        </NavItem>
        <NavItem href="https://keystonejs.com/">
          <Icon src={bookIcon} />
          <Text>KeystoneJS Docs</Text>
        </NavItem>
      </NavGroup>
    </NavList>
  );
};

export const recursiveItems = (items: SidebarItem[], currentPath: string) => {
  return items.map(linkOrGroup => {
    let key = '';
    if ('children' in linkOrGroup) {
      key += linkOrGroup.name;
      return (
        <NavGroup key={key} title={linkOrGroup.name}>
          {recursiveItems(linkOrGroup.children, currentPath)}
        </NavGroup>
      );
    }

    const current = linkOrGroup.href === currentPath ? 'page' : undefined;
    return (
      <NavItem
        key={key + linkOrGroup.name}
        href={linkOrGroup.href}
        aria-current={current}
      >
        {linkOrGroup.name}
      </NavItem>
    );
  });
};

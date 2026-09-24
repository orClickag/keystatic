import type { ComponentLibraryTemplates } from '@orclickag/keystatic-components';
import { Button01Fields } from '../common/buttons/ButtonFields';
import { Footer01Fields } from '../common/footer/Footer01Fields';
import { Menu01Fields } from '../common/menu/Menu01Fields';
import { CtaFields } from './content/cta/CtaFields';
import { HeaderHomeFields } from './content/header-home/HeaderHomeFields';
import { Features01Fields } from './features/01/Features01Fields';
import { Features02Fields } from './features/02/Features02Fields';

export const componentLibraryTemplates: ComponentLibraryTemplates = {
  components: {
    headerHome: { label: 'Header Home', schema: HeaderHomeFields() },
    cta: { label: 'CTA', schema: CtaFields() },
  },
  features: {
    features01: { label: 'Features 01', schema: Features01Fields() },
    features02: { label: 'Features 02', schema: Features02Fields() },
  },
  menus: {
    menu01: { label: 'Menu 01', schema: Menu01Fields() },
  },
  footers: {
    footer01: { label: 'Footer 01', schema: Footer01Fields() },
  },
};

export const pageBuilderTemplates = [
  {
    collection: 'components' as const,
    template: 'headerHome',
    label: 'Header Home',
  },
  { collection: 'components' as const, template: 'cta', label: 'CTA' },
  {
    collection: 'feature' as const,
    template: 'features01',
    label: 'Features 01',
  },
  {
    collection: 'feature' as const,
    template: 'features02',
    label: 'Features 02',
  },
];

export { Button01Fields };

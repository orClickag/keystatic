import { createComponentLibraryCollections } from '@orclickag/keystatic-components';
import {
  createContentCollections,
  createContentSingletons,
} from '@orclickag/keystatic-content';
import { config } from '@orclickag/keystatic-core';
import {
  componentLibraryTemplates,
  pageBuilderTemplates,
} from './src/components/widgets/keystatic';

export default config({
  storage: {
    kind: 'local',
  },
  locale: 'pt-BR',
  ui: {
    brand: { name: 'Astro Page Builder' },
    navigation: {
      Conteúdo: ['pages', 'blogPosts', 'catalogs', 'libraryEntries'],
      Mídia: ['mediaLibrary'],
      'Biblioteca de blocos': [
        'components',
        'feature',
        'links',
        'menus',
        'footers',
      ],
      Configurações: ['branches'],
    },
  },
  collections: {
    ...createContentCollections({
      pageBuilder: { templates: pageBuilderTemplates },
    }),
    ...createComponentLibraryCollections({
      templates: componentLibraryTemplates,
    }),
  },
  singletons: createContentSingletons(),
});

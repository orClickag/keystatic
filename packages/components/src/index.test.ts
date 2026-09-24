import { fields } from '@orclickag/keystatic-core';
import { describe, expect, it } from 'vitest';
import { createComponentLibraryCollections, resolveLibraryLink } from './index';

const templates = {
  components: {
    headerHome: {
      label: 'Header Home',
      schema: { title: fields.text({ label: 'Título' }) },
    },
  },
  features: {
    features01: {
      label: 'Features 01',
      schema: { title: fields.text({ label: 'Título' }) },
    },
  },
  menus: {
    menu01: {
      label: 'Menu 01',
      schema: {
        items: fields.array(fields.text({ label: 'Item' }), { label: 'Itens' }),
      },
    },
  },
  footers: {
    footer01: {
      label: 'Footer 01',
      schema: { title: fields.text({ label: 'Título' }) },
    },
  },
};

describe('component library', () => {
  it('creates standard collections from templates owned by the app', () => {
    const collections = createComponentLibraryCollections({ templates });

    expect(Object.keys(collections)).toEqual([
      'components',
      'feature',
      'links',
      'menus',
      'footers',
    ]);
    expect(collections.components.path).toBe('src/content/components/*');
    expect(collections.feature.path).toBe('src/content/features/*');
  });

  it('allows content paths to be customized', () => {
    const collections = createComponentLibraryCollections({
      templates,
      paths: { components: 'content/widgets/*', footers: 'content/footers/*' },
    });

    expect(collections.components.path).toBe('content/widgets/*');
    expect(collections.footers.path).toBe('content/footers/*');
  });

  it('requires the app to define at least one template per collection', () => {
    expect(() =>
      createComponentLibraryCollections({
        templates: { ...templates, features: {} },
      })
    ).toThrow('feature template');
  });

  it('adds safe browser attributes only when a link opens in a new tab', () => {
    expect(resolveLibraryLink({ title: 'Interno', link: '/sobre' })).toEqual({
      href: '/sobre',
    });
    expect(
      resolveLibraryLink({
        title: 'Externo',
        link: 'https://example.com',
        newTab: true,
      })
    ).toEqual({
      href: 'https://example.com',
      target: '_blank',
      rel: 'noopener noreferrer',
    });
  });
});

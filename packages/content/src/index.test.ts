import { describe, expect, it } from 'vitest';
import { createContentCollections, createContentSingletons } from './index';

describe('content library', () => {
  it('creates Fitinox-derived content and settings collections', () => {
    const collections = createContentCollections();

    expect(Object.keys(collections)).toEqual([
      'pages',
      'blogPosts',
      'catalogs',
      'libraryEntries',
      'branches',
    ]);
    expect(collections.pages.path).toBe('src/content/pages/*');
    expect(collections.pages.entryLayout).toBe('content');
    expect(collections.pages.format).toEqual({
      data: 'yaml',
      contentField: 'builder',
    });
    expect(collections.blogPosts.path).toBe('src/content/blog/*');
    expect(collections.blogPosts.entryLayout).toBe('content');
    expect(collections.catalogs.entryLayout).toBe('content');
    expect(collections.catalogs.format).toEqual({
      data: 'yaml',
      contentField: 'paragraph',
    });
    expect(collections.branches.path).toBe('src/content/settings/branches/*');
  });

  it('customizes paths and preview URLs for a consuming site', () => {
    const collections = createContentCollections({
      paths: {
        pages: 'content/pages/*',
        branches: 'content/settings/branches/*',
      },
      previewBaseUrl: 'https://example.com/',
    });

    expect(collections.pages.path).toBe('content/pages/*');
    expect(collections.branches.path).toBe('content/settings/branches/*');
    expect(collections.pages.previewUrl).toBe(
      'https://example.com/preview/{slug}'
    );
    expect(collections.blogPosts.previewUrl).toBe(
      'https://example.com/blog/{slug}'
    );
  });

  it('creates the media library singleton', () => {
    const singletons = createContentSingletons({
      mediaLibraryPath: 'content/media-library',
    });

    expect(singletons.mediaLibrary.path).toBe('content/media-library');
  });
});

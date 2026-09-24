import { describe, expect, it } from 'vitest';
import { createComponentRegistry, normalizeComponentReference } from './index';

describe('component registry', () => {
  it('rejects duplicate component ids', () => {
    expect(() => createComponentRegistry([{ id: 'hero', label: 'Hero' }, { id: 'hero', label: 'Hero 2' }])).toThrow('Duplicate');
  });

  it('normalizes persisted Fitinox v1 references', () => {
    expect(normalizeComponentReference({ discriminant: 'imageCta', value: 'summer-sale' })).toEqual({
      componentId: 'imageCta', entryId: 'summer-sale',
    });
  });
});

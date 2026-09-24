export type ComponentReference = {
  componentId: string;
  entryId: string;
};

export type LegacyComponentReference = {
  discriminant: string;
  value: string;
};

export type ComponentDefinition<Schema = unknown> = {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  schema?: Schema;
  preview?: string;
};

export type ComponentRegistry<Schema = unknown> = {
  all(): readonly ComponentDefinition<Schema>[];
  get(id: string): ComponentDefinition<Schema> | undefined;
  has(id: string): boolean;
};

/** Creates the project-agnostic catalog consumed by the editor and renderer. */
export function createComponentRegistry<Schema = unknown>(
  definitions: readonly ComponentDefinition<Schema>[]
): ComponentRegistry<Schema> {
  const byId = new Map<string, ComponentDefinition<Schema>>();
  for (const definition of definitions) {
    if (!definition.id.trim())
      throw new Error('A page-builder component id is required.');
    if (byId.has(definition.id))
      throw new Error(`Duplicate page-builder component id: ${definition.id}`);
    byId.set(definition.id, Object.freeze({ ...definition }));
  }
  const components = Object.freeze([...byId.values()]);
  return Object.freeze({
    all: () => components,
    get: id => byId.get(id),
    has: id => byId.has(id),
  });
}

export function componentReference(
  componentId: string,
  entryId: string
): ComponentReference {
  if (!componentId.trim() || !entryId.trim())
    throw new Error('Both componentId and entryId are required.');
  return { componentId, entryId };
}

/** Reads persisted references from both the reusable format and the Fitinox v1 format. */
export function normalizeComponentReference(
  value: unknown
): ComponentReference | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (
    typeof record.componentId === 'string' &&
    typeof record.entryId === 'string'
  ) {
    return componentReference(record.componentId, record.entryId);
  }
  if (
    typeof record.discriminant === 'string' &&
    typeof record.value === 'string'
  ) {
    return componentReference(record.discriminant, record.value);
  }
  return null;
}

export type PageBlockTemplate = {
  collection: 'components' | 'feature';
  template: string;
  label: string;
};

export type PageBlockReference = {
  collection: 'components' | 'feature';
  id: string;
};

export type PageBuilderFieldOptions = {
  endpoint?: string;
  label?: string;
  templates?: readonly PageBlockTemplate[];
};

export function parsePageBlockReferences(value: unknown): PageBlockReference[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap(item => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
    const record = item as Record<string, unknown>;
    if (
      (record.collection === 'components' || record.collection === 'feature') &&
      typeof record.id === 'string'
    ) {
      return [{ collection: record.collection, id: record.id }];
    }
    return [];
  });
}

export { pageBuilderField } from './field';

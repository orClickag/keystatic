'use client';

import type { CSSProperties } from 'react';

export type ComponentCatalogItem = {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  preview?: string;
};

export type ComponentCatalogProps = {
  items: readonly ComponentCatalogItem[];
  onSelect(item: ComponentCatalogItem): void;
  selectedId?: string;
  emptyMessage?: string;
};

const styles = {
  list: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))',
    gap: 12,
  } satisfies CSSProperties,
  item: {
    appearance: 'none',
    display: 'grid',
    gap: 6,
    padding: 14,
    textAlign: 'left',
    color: 'inherit',
    background: 'var(--keystatic-color-scale-2, #fff)',
    border: '1px solid var(--keystatic-color-scale-5, #d4d4d8)',
    borderRadius: 8,
    cursor: 'pointer',
  } satisfies CSSProperties,
};

/** A small, accessible catalog primitive for page-builder component selection. */
export function ComponentCatalog({ items, onSelect, selectedId, emptyMessage = 'Nenhum componente disponível.' }: ComponentCatalogProps) {
  if (!items.length) return <p>{emptyMessage}</p>;
  return <div style={styles.list} role="list">
    {items.map(item => <button
      aria-pressed={item.id === selectedId}
      key={item.id}
      onClick={() => onSelect(item)}
      role="listitem"
      style={{ ...styles.item, ...(item.id === selectedId ? { outline: '2px solid var(--keystatic-color-scale-9, #4f46e5)' } : {}) }}
      type="button"
    >
      {item.icon ? <span aria-hidden>{item.icon}</span> : null}
      <strong>{item.label}</strong>
      {item.description ? <span>{item.description}</span> : null}
    </button>)}
  </div>;
}

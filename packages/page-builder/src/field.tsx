import type {
  ContentFormField,
  FormFieldInputProps,
} from '@orclickag/keystatic-core';
import { useEffect, useState } from 'react';
import { parsePageBlockReferences } from './index';
import type { PageBlockReference, PageBuilderFieldOptions } from './index';

type LibraryItem = PageBlockReference & { label: string };

const decoder = new TextDecoder();
const encoder = new TextEncoder();

function PageBuilderInput({
  value,
  onChange,
  forceValidation,
  endpoint,
  templates,
}: FormFieldInputProps<PageBlockReference[]> &
  Required<Pick<PageBuilderFieldOptions, 'endpoint' | 'templates'>>) {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [existing, setExisting] = useState('');
  const [template, setTemplate] = useState('');

  useEffect(() => {
    fetch(`${endpoint}/blocks`)
      .then(response => (response.ok ? response.json() : []))
      .then(result => setItems(Array.isArray(result) ? result : []))
      .catch(() => setItems([]));
  }, [endpoint]);

  async function createInline() {
    const selected = templates.find(
      item => `${item.collection}:${item.template}` === template
    );
    const name = window.prompt('Nome do novo bloco:');
    if (!selected || !name) return;
    const response = await fetch(`${endpoint}/blocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...selected, name }),
    });
    if (!response.ok) return;
    const item = (await response.json()) as LibraryItem;
    onChange([...value, { collection: item.collection, id: item.id }]);
    setItems(current => [...current, item]);
  }

  function addExisting() {
    const item = items.find(
      item => `${item.collection}:${item.id}` === existing
    );
    if (item)
      onChange([...value, { collection: item.collection, id: item.id }]);
  }

  return (
    <div style={{ display: 'grid', gap: 16, padding: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <select
          aria-label="Modelo de bloco"
          value={template}
          onChange={event => setTemplate(event.target.value)}
        >
          <option value="">Criar inline…</option>
          {templates.map(item => (
            <option
              key={`${item.collection}:${item.template}`}
              value={`${item.collection}:${item.template}`}
            >
              {item.label}
            </option>
          ))}
        </select>
        <button
          disabled={!template}
          onClick={() => void createInline()}
          type="button"
        >
          Criar bloco
        </button>
        <select
          aria-label="Bloco existente"
          value={existing}
          onChange={event => setExisting(event.target.value)}
        >
          <option value="">Adicionar existente…</option>
          {items.map(item => (
            <option
              key={`${item.collection}:${item.id}`}
              value={`${item.collection}:${item.id}`}
            >
              {item.label}
            </option>
          ))}
        </select>
        <button disabled={!existing} onClick={addExisting} type="button">
          Adicionar
        </button>
      </div>
      {forceValidation && !value.length ? (
        <p role="alert">Adicione pelo menos um bloco.</p>
      ) : null}
      <ol>
        {value.map((item, index) => (
          <li key={`${item.collection}:${item.id}:${index}`}>
            {item.id}{' '}
            <button
              onClick={() =>
                onChange(value.filter((_, itemIndex) => itemIndex !== index))
              }
              type="button"
            >
              Remover
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function pageBuilderField(
  options: PageBuilderFieldOptions = {}
): ContentFormField<
  PageBlockReference[],
  PageBlockReference[],
  PageBlockReference[]
> {
  const endpoint = options.endpoint ?? '/api/page-builder';
  const templates = options.templates ?? [];
  return {
    kind: 'form',
    formKind: 'content',
    contentExtension: '.json',
    label: options.label ?? 'Designer',
    Input: props => (
      <PageBuilderInput {...props} endpoint={endpoint} templates={templates} />
    ),
    defaultValue: () => [],
    parse: (_, { content }) => {
      try {
        return parsePageBlockReferences(JSON.parse(decoder.decode(content)));
      } catch {
        return [];
      }
    },
    serialize: value => ({
      value: undefined,
      content: encoder.encode(JSON.stringify(value)),
      external: new Map(),
      other: new Map(),
    }),
    validate: value => value,
    reader: {
      parse: (_, { content }) => {
        try {
          return parsePageBlockReferences(JSON.parse(decoder.decode(content)));
        } catch {
          return [];
        }
      },
    },
  };
}

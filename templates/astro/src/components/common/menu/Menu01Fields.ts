import { fields } from '@orclickag/keystatic-core';

export function Menu01Fields() {
  return {
    items: fields.array(
      fields.relationship({ label: 'Link', collection: 'links' }),
      {
        label: 'Itens',
        itemLabel: props => props.value || 'Selecionar link',
      }
    ),
  };
}

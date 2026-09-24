import { fields } from '@orclickag/keystatic-core';

export function Footer01Fields() {
  return {
    columns: fields.array(
      fields.object({
        title: fields.text({ label: 'Título' }),
        text: fields.text({ label: 'Texto', multiline: true }),
        menu: fields.relationship({ label: 'Menu', collection: 'menus' }),
      }),
      {
        label: 'Colunas',
        itemLabel: props => props.fields.title.value || 'Nova coluna',
      }
    ),
  };
}

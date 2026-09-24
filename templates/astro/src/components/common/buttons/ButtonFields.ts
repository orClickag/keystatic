import { fields } from '@orclickag/keystatic-core';

export function Button01Fields() {
  return {
    link: fields.relationship({
      label: 'Link',
      collection: 'links',
      validation: { isRequired: true },
    }),
    style: fields.select({
      label: 'Estilo',
      options: [
        { label: 'Button 01', value: 'button01' },
        { label: 'Button 02', value: 'button02' },
      ],
      defaultValue: 'button01',
    }),
  };
}

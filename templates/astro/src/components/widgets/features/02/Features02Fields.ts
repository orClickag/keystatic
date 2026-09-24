import { fields } from '@orclickag/keystatic-core';

export function Features02Fields() {
  return {
    eyebrow: fields.text({ label: 'Eyebrow' }),
    title: fields.text({ label: 'Título', validation: { isRequired: true } }),
    items: fields.array(
      fields.object({
        title: fields.text({
          label: 'Título',
          validation: { isRequired: true },
        }),
        description: fields.text({ label: 'Descrição', multiline: true }),
      }),
      { label: 'Itens' }
    ),
  };
}

import { fields } from '@orclickag/keystatic-core';

export function Features01Fields() {
  return {
    title: fields.text({ label: 'Título', validation: { isRequired: true } }),
    description: fields.text({ label: 'Descrição', multiline: true }),
    cards: fields.array(
      fields.object({
        icon: fields.text({ label: 'Ícone' }),
        title: fields.text({
          label: 'Título',
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: 'Descrição',
          multiline: true,
          validation: { isRequired: true },
        }),
      }),
      { label: 'Cards' }
    ),
  };
}

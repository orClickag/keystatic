import { fields } from '@orclickag/keystatic-core';
import { Button01Fields } from '../../../common/buttons/ButtonFields';

export function HeaderHomeFields() {
  return {
    eyebrow: fields.text({ label: 'Eyebrow' }),
    title: fields.text({ label: 'Título', validation: { isRequired: true } }),
    description: fields.text({ label: 'Descrição', multiline: true }),
    buttons: fields.array(fields.object(Button01Fields()), { label: 'Botões' }),
    backgroundImage: fields.object({
      src: fields.url({ label: 'URL da imagem' }),
      alt: fields.text({ label: 'Texto alternativo' }),
    }),
  };
}

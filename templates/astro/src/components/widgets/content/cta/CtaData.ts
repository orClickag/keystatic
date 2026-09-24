import type { ButtonData } from '../../../common/buttons/ButtonData';

export type CtaData = {
  title: string;
  description?: string;
  buttons?: ButtonData[];
  image?: { src?: string; alt?: string };
};

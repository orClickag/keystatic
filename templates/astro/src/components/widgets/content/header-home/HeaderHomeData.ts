import type { ButtonData } from '../../../common/buttons/ButtonData';

export type HeaderHomeData = {
  eyebrow?: string;
  title: string;
  description?: string;
  buttons?: ButtonData[];
  backgroundImage?: { src?: string; alt?: string };
};

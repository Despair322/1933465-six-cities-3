import { FavoriteButtonVariants } from '../../constants/app';

export type FavoriteButtonVariant = typeof FavoriteButtonVariants[keyof typeof FavoriteButtonVariants];

export type FavoriteButtonProps = {
  isFavorite: boolean;
  id: string;
  variant?: FavoriteButtonVariant;
};

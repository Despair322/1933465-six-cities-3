import { FavoriteButtonVariants } from '../../constants';

export type FavoriteButtonVariant = typeof FavoriteButtonVariants[keyof typeof FavoriteButtonVariants];

export type FavoriteButtonProps = {
  isFavorite: boolean;
  id: string;
  variant?: FavoriteButtonVariant;
};

import { useMemo } from 'react';
import { CardProps } from '../../interfaces';
import { SortOption } from '../../types/sort-options';

export const useSortNFTs = (cards: CardProps[] | null, sort: SortOption) => {
  return useMemo(() => {
    if (!cards) return null;

    const sorted = [...cards];
    switch (sort) {
      case 'date_asc':
        return sorted.sort((a, b) => Number(a.created_at - b.created_at));
      case 'date_desc':
        return sorted.sort((a, b) => Number(b.created_at - a.created_at));
      case 'likes_asc':
        return sorted.sort((a, b) => Number(a.likes - b.likes));
      case 'likes_desc':
        return sorted.sort((a, b) => Number(b.likes - a.likes));
      default:
        return sorted;
    }
  }, [cards, sort]);
};

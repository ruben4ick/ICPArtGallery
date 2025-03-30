import React, { createContext, useContext, useState } from 'react';
import { SortOption } from '../../types/sort-options';

interface GalleryContextType {
  sort: SortOption;
  setSort: (s: SortOption) => void;
}

const GalleryContext = createContext<GalleryContextType>({
  sort: 'none',
  setSort: () => {}
});

export const useGalleryContext = () => useContext(GalleryContext);

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sort, setSort] = useState<SortOption>('none');

  return <GalleryContext.Provider value={{ sort, setSort }}>{children}</GalleryContext.Provider>;
};

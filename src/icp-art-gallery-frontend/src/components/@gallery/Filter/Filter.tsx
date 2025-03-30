import { useGalleryContext } from '../../../context/@nfts/GaleryContext';
import '../../../index.scss';
import './style.scss';
import { useState } from 'react';
import {SortOption} from "../../../types/sort-options";


const options: { label: string; value: SortOption }[] = [
  { label: 'None', value: 'none' },
  { label: 'Date ↑', value: 'date_asc' },
  { label: 'Date ↓', value: 'date_desc' },
  { label: 'Likes ↑', value: 'likes_asc' },
  { label: 'Likes ↓', value: 'likes_desc' }
];

export const Filter = () => {
  const { sort, setSort } = useGalleryContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
      <div className="relative">
        <button className="head-text cursor-pointer" onClick={() => setIsOpen(!isOpen)} type="button">
          .filter: {sort}
        </button>
        {isOpen ? <div className="glass modal-glass absolute mt-2 w-48 rounded z-99">
              {options.map(({ label, value }) => (
                  <button
                      className="option block w-full text-left px-4 py-2"
                      key={value}
                      onClick={() => {
                        setSort(value);
                        setIsOpen(false);
                      }}
                      type="button"
                  >
                    {label}
                  </button>
              ))}
            </div> : null}
      </div>
  );
};


export default Filter;

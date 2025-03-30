import React, { createContext, useContext, useState, useEffect } from 'react';
import { CardProps} from '../../interfaces';
import {fetchAllNFTs} from "../../utils/fetch-all-nfts";

interface NftContextType {
  cards: CardProps[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const NftContext = createContext<NftContextType>({
  cards: null,
  loading: false,
  error: null,
  refetch: () => {}
});

export const useNfts = () => useContext(NftContext);

export const NftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<CardProps[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      const mapped = await fetchAllNFTs();
      setCards(mapped);
      setError(null);
    } catch (e) {
      console.error('Fetch NFTs failed:', e);
      setError('Failed to load NFTs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <NftContext.Provider value={{ cards, loading, error, refetch: fetchNFTs }}>
      {children}
    </NftContext.Provider>
  );
};

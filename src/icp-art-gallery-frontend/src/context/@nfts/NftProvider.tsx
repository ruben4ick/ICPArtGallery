// src/context/NftContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { Buffer } from 'buffer';
import { Principal } from '@dfinity/principal';
import { createAnonymousActor } from '../../hooks/wallet-login/anonymous-actor';
import { CardProps, NFT } from '../../interfaces';

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
  refetch: () => {},
});

export const useNfts = () => useContext(NftContext);

export const NftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<CardProps[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      const actor = createAnonymousActor();
      const result: NFT[] = await actor.get_all_nfts();

      const mapped = result.map((nft) => ({
        name: nft.metadata.name,
        imageLink: `data:${nft.metadata.content_type};base64,${Buffer.from(nft.metadata.image_data as Uint8Array).toString('base64')}`,
        like_percentage: Math.floor(Math.random() * 100),
      }));

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

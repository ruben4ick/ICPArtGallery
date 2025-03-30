import { useEffect, useState } from 'react';
import { CardProps } from '../../interfaces';
import { fetchAllNFTs } from '../../utils/fetch-all-nfts';

export const usePublicNFTs = () => {
  const [cards, setCards] = useState<CardProps[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      const mappedCards = await fetchAllNFTs();
      setCards(mappedCards);
      setError(null);
    } catch (err) {
      console.error('Error loading public NFTs:', err);
      setError('Failed to load NFTs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  return { cards, loading, error, refetch: fetchNFTs };
};

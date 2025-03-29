import { useEffect, useState } from 'react';

import { Buffer } from 'buffer';
import { createAnonymousActor } from '../wallet-login/anonymous-actor';
import { CardProps, NFT } from '../../interfaces';

export const usePublicNFTs = () => {
  const [cards, setCards] = useState<CardProps[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = async () => {
    try {
      setLoading(true);
      const actor = createAnonymousActor();
      const result: NFT[] = await actor.get_all_nfts();

      const mappedCards: CardProps[] = result.map((nft) => ({
        name: nft.metadata.name,
        imageLink: `data:${nft.metadata.content_type};base64,${Buffer.from(nft.metadata.image_data as Uint8Array).toString('base64')}`,
        like_percentage: Math.floor(Math.random() * 100),
      }));

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


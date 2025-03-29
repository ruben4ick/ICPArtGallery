import { useEffect, useState } from 'react';
import { Principal } from '@dfinity/principal';

import { Buffer } from 'buffer';
import { createAnonymousActor } from '../wallet-login/anonymous-actor';

export interface NFT {
  id: bigint;
  owner: Principal;
  metadata: {
    name: string;
    description: string;
    image_data: Uint8Array | number[];
    content_type: string;
  };
}

export interface CardProps {
  name?: string;
  imageLink: string;
  like_percentage?: number;
}

export const usePublicNFTs = () => {
  const [cards, setCards] = useState<CardProps[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const actor = createAnonymousActor();
        const result: NFT[] = await actor.get_all_nfts();

        const mappedCards: CardProps[] = result.map((nft) => ({
          name: nft.metadata.name,
          imageLink: `data:${nft.metadata.content_type};base64,${Buffer.from(nft.metadata.image_data as Uint8Array).toString('base64')}`,
          like_percentage: Math.floor(Math.random() * 100)
        }));

        setCards(mappedCards);
      } catch (err) {
        console.error('.error loading public NFTs:', err);
        setError('Failed to load NFTs');
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  return { cards, loading, error };
};

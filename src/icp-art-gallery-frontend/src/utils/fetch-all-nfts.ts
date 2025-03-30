import { Buffer } from 'buffer';
import { createAnonymousActor } from '../hooks/wallet-login/anonymous-actor';
import { CardProps, NFT } from '../interfaces';

export const fetchAllNFTs = async (): Promise<CardProps[]> => {
  const actor = createAnonymousActor();
  const result: NFT[] = await actor.get_all_nfts();

  return result.map((nft) => ({
    id: nft.id,
    name: nft.metadata.name,
    description: nft.metadata.description,
    imageLink: `data:${nft.metadata.content_type};base64,${Buffer.from(nft.metadata.image_data as Uint8Array).toString('base64')}`,
    likes: nft.likes,
    dislikes: nft.dislikes,
    created_at: nft.created_at,
    owner: nft.owner
  }));
};

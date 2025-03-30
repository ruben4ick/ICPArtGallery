import { useNfts } from '../../context/@nfts/NftProvider';
import { createAnonymousActor } from '../wallet-login/anonymous-actor';
import { createPlugActor } from '../wallet-login/plug-auth';

declare const __DFX_NETWORK__: string;

export const useNftInteractions = () => {
  const { refetch } = useNfts();

  const likeNft = async (id: bigint) => {
    try {
      const isLocalnet = __DFX_NETWORK__ === 'local';

      const actor = isLocalnet ? createAnonymousActor() : createPlugActor();
      await actor.like_nft(id);
      console.log(`Liked NFT ${id}`);
      refetch();
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const dislikeNft = async (id: bigint) => {
    try {
      const isLocalnet = __DFX_NETWORK__ === 'local';

      //actor = createAnonymousActor //for local development
      const actor = isLocalnet ? createAnonymousActor() : createPlugActor();
      await actor.dislike_nft(id);
      console.log(`Disliked NFT ${id}`);
      refetch();
    } catch (err) {
      console.error('Dislike failed:', err);
    }
  };

  return { likeNft, dislikeNft };
};

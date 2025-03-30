import {useNfts} from "../../context/@nfts/NftProvider";
import {createActor} from "../../actor";

export const useNftInteractions = () => {
    const { refetch } = useNfts();

    const likeNft = async (id: bigint) => {
        try {
            const actor = createActor();
            await actor.like_nft(id);
            console.log(`Liked NFT ${id}`);
            refetch();
        } catch (err) {
            console.error('Like failed:', err);
        }
    };

    const dislikeNft = async (id: bigint) => {
        try {
            const actor = createActor();
            await actor.dislike_nft(id);
            console.log(`Disliked NFT ${id}`);
            refetch();
        } catch (err) {
            console.error('Dislike failed:', err);
        }
    };

    return { likeNft, dislikeNft };
};

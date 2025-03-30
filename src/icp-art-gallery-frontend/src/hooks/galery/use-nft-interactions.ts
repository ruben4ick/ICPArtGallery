import {useNfts} from "../../context/@nfts/NftProvider";
import {createAnonymousActor} from "../wallet-login/anonymous-actor";
import {createPlugActor} from "../wallet-login/plug-auth";


export const useNftInteractions = () => {
    const { refetch } = useNfts();

    const likeNft = async (id: bigint) => {
        try {
            const actor = createPlugActor()
            // const actor = createAnonymousActor() // for local development

            await actor.like_nft(id);
            console.log(`Liked NFT ${id}`);
            refetch();
        } catch (err) {
            console.error('Like failed:', err);
        }
    };

    const dislikeNft = async (id: bigint) => {
        try {
            const actor = createPlugActor()
            // const actor = createAnonymousActor() // for local development

            await actor.dislike_nft(id);
            console.log(`Disliked NFT ${id}`);
            refetch();
        } catch (err) {
            console.error('Dislike failed:', err);
        }
    };

    return { likeNft, dislikeNft };
};

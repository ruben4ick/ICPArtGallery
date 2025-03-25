import { Actor } from '@dfinity/agent';
import { idlFactory as backendIDL } from '../../../../declarations/icp-art-gallery-backend';
import type { _SERVICE } from '../../../../declarations/icp-art-gallery-backend/icp-art-gallery-backend.did.d.ts';

const canisterId = import.meta.env.VITE_CANISTER_ID_ICP_ART_GALLERY_BACKEND;

export const loginWithPlug = async (): Promise<string | null> => {
    const isPlugAvailable = typeof window !== 'undefined' && window.ic?.plug;

    if (!isPlugAvailable) {
        alert('Plug Wallet not found. Please install the extension.');
        return null;
    }

    const connected = await window.ic?.plug?.requestConnect({
        whitelist: [canisterId],
        host: "https://icp0.io"
    });

    if (!connected) {
        alert('Plug connection rejected.');
        return null;
    }

    const principal = await window.ic?.plug?.getPrincipal();
    return principal?.toText() ?? null;
};

export const createPlugActor = async () => {
    const plugAgent = window.ic?.plug?.agent;

    if (!plugAgent) {
        throw new Error("Plug agent not initialized. Try connecting first.");
    }

    return Actor.createActor<_SERVICE>(backendIDL, {
        agent: plugAgent,
        canisterId,
    });
};

export const logoutPlug = () => {
    console.log("User manually disconnected.");
};

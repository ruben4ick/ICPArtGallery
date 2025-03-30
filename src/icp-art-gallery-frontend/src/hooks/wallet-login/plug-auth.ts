import { Actor } from '@dfinity/agent';
import { idlFactory as backendIDL } from '../../../../declarations/icp-art-gallery-backend';
import type { _SERVICE } from '../../../../declarations/icp-art-gallery-backend/icp-art-gallery-backend.did.d.ts';

declare const __BACKEND_CANISTER_ID__: string;
const canisterId = __BACKEND_CANISTER_ID__;

export const loginWithPlug = async (): Promise<string | null> => {
  if (!window.ic || !window.ic.plug) {
    alert('Plug Wallet not found. Please install the extension.');
    return null;
  }
  const isConnected = await window.ic.plug.isConnected();
  if (!isConnected) {
    try {
      const connected = await window.ic.plug.requestConnect({
        whitelist: [canisterId],
        host: 'https://icp0.io'
      });

      if (!connected) {
        console.warn('Plug connection rejected.');
        return null;
      }
    } catch (e) {
      console.error('Plug connection error:', e);
      return null;
    }
  }

  const principal = await window.ic.plug.getPrincipal();
  return principal.toText();
};

export const createPlugActor = () => {
  const plugAgent = window.ic?.plug?.agent;

  if (!plugAgent) {
    throw new Error('Plug agent not initialized. Try connecting first.');
  }

  return Actor.createActor<_SERVICE>(backendIDL, {
    agent: plugAgent,
    canisterId
  });
};

export const logoutPlug = () => {
  console.log('User manually disconnected.');
};

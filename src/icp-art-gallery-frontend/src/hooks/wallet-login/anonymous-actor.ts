import { Actor, HttpAgent } from '@dfinity/agent';
import { canisterId } from '../../../../declarations/icp-art-gallery-backend';
import type { _SERVICE } from '../../../../declarations/icp-art-gallery-backend/icp-art-gallery-backend.did.d.ts';
import { idlFactory } from '../../../../declarations/icp-art-gallery-backend';

export const createAnonymousActor = () => {
  const agent = new HttpAgent();
  if (import.meta.env.VITE_DFX_NETWORK !== 'ic') {
    agent.fetchRootKey();
  }

  return Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId
  });
};

import { Actor, HttpAgent } from '@dfinity/agent';
import { canisterId } from '../../../../declarations/icp-art-gallery-backend';
import type { _SERVICE } from '../../../../declarations/icp-art-gallery-backend/icp-art-gallery-backend.did.d.ts';
import { idlFactory } from '../../../../declarations/icp-art-gallery-backend';

declare const __DFX_NETWORK__: string;

export const createAnonymousActor = (): import('@dfinity/agent').ActorSubclass<_SERVICE> => {
  const agent = new HttpAgent();

  if (__DFX_NETWORK__ !== 'ic') {
    agent.fetchRootKey();
  }

  return Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId
  });
};

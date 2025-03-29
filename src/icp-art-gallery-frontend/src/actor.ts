import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../declarations/icp-art-gallery-backend/icp-art-gallery-backend.did.js';
import type { _SERVICE } from '../../declarations/icp-art-gallery-backend/icp-art-gallery-backend.did';
import { canisterId as backendId } from '../../declarations/icp-art-gallery-backend';

export const createActor = (): import('@dfinity/agent').ActorSubclass<_SERVICE> => {
  const agent = new HttpAgent();

  agent.fetchRootKey();

  return Actor.createActor<_SERVICE>(idlFactory, {
    agent,
    canisterId: backendId
  });
};

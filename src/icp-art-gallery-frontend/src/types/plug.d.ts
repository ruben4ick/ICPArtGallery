// src/types/plug.d.ts

import type { HttpAgent } from '@dfinity/agent';

export {};

declare global {
  interface Window {
    ic?: {
      plug?: {
        requestConnect: (opts?: { whitelist: string[]; host?: string }) => Promise<boolean>;
        isConnected: () => Promise<boolean>;
        createAgent: (opts: { whitelist: string[] }) => Promise<void>;
        getAgent: () => HttpAgent;
        getPrincipal: () => Promise<import('@dfinity/principal').Principal>;
        agent?: HttpAgent;
        sessionManager?: {
          sessionData?: unknown;
        };
      };
    };
  }
}

import { Principal } from '@dfinity/principal';

export interface NFT {
  id: bigint;
  owner: Principal;
  metadata: {
    name: string;
    description: string;
    image_data: Uint8Array | number[];
    content_type: string;
  };
}

import { Principal } from '@dfinity/principal';

export interface NFT {
  id: bigint;
  owner: Principal;
  created_at: bigint;
  likes: bigint;
  dislikes: bigint;
  metadata: {
    name: string;
    description: string;
    image_data: Uint8Array | number[];
    content_type: string;
  };
}

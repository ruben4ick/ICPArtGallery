import {Principal} from "@dfinity/principal";

export interface CardProps {
  name?: string;
  imageLink: string;
  likes: bigint;
  dislikes: bigint;
  created_at: bigint;
  description?: string;
  owner: Principal | string;
}

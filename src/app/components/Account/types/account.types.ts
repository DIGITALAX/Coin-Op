import { AccessControlConditions } from "@lit-protocol/types";
import { Details } from "../../Walkthrough/types/walkthrough.types";

export interface EncryptedDetails {
  ciphertext: string;
  dataToEncryptHash: string;
  accessControlConditions: AccessControlConditions | undefined;
  chainId: string;
}

export interface CompositeOrder {
  orderId: string;
  totalPrice: string;
  currency: string;
  tokenId: string;
  parentId: string;
  parentTokenId: string;
  buyer: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  compositeURI: string;
  compositeMetadata: {
    image: string;
    title: string;
    color: string;
    size: string;
  };
  isFulfilled: boolean;
  status: Status;
  details?: Details | EncryptedDetails | string;
  decrypted: boolean;
}

export interface Order {
  orderId: string;
  totalPrice: string;
  currency: string;
  postId: string;
  buyer: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  collection: {
    collectionId: string;
    metadata: {
      images: string[];
      title: string;
    };
  };
  isFulfilled: boolean;
  status: Status;
  amount: string;
  details?: Details | EncryptedDetails | string;
  decrypted: boolean;
}

export enum Status {
  Fulfilled = "Fulfilled",
  Shipped = "Shipped",
  Shipping = "Shipping",
  Designing = "Designing",
}

export type OrderProps = {
  order: Order;
  orderOpen: boolean[];
  setOrderOpen: (e: boolean[]) => void;
  index: number;
  handleDecryptFulfillment: (order: Order) => Promise<void>;
  decryptLoading: boolean[];
  dict: any;
  connected: boolean;
  chainId: number | undefined;
};

export type CompositeOrderProps = {
  order: CompositeOrder;
  orderOpen: boolean[];
  setOrderOpen: (e: boolean[]) => void;
  index: number;
  handleDecryptFulfillment: (order: CompositeOrder) => Promise<void>;
  decryptLoading: boolean[];
  dict: any;
  connected: boolean;
  chainId: number | undefined;
};

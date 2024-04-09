import { Profile } from "@/components/Common/types/generated";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { AnyAction, Dispatch } from "redux";
import { NextRouter } from "next/router";
import { AccessControlConditions } from "@lit-protocol/types";
import { Details } from "@/components/Common/types/common.types";
import { TFunction } from "i18next";

export interface Order {
  orderId: string;
  totalPrice: string;
  currency: string;
  pubId: string;
  profileId: string;
  buyer: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  images: string[];
  orderMetadata: {
    names: string[];
    messages: string[];
  };
  details?: Details | EncryptedDetails | string;
  subOrders: Sub[];
  decrypted: boolean;
}

export interface EncryptedDetails {
  ciphertext: string;
  dataToEncryptHash: string;
  accessControlConditions: AccessControlConditions | undefined;
}

export interface Sub {
  price: string;
  status: string;
  collection: {
    name: string;
    image: string;
    origin: string;
    pubId: string;
  };
  isFulfilled: boolean;
  amount?: string;
  color?: string;
  size?: string;
}

export type AllOrdersProps = {
  connected: boolean;
  ordersLoading: boolean;
  allOrders: Order[];
  orderOpen: boolean[];
  setOrderOpen: (e: boolean[]) => void;
  handleDecryptFulfillment: (order: Order) => Promise<void>;
  decryptLoading: boolean[];
  dispatch: Dispatch<AnyAction>;
  chain: number | undefined;
  openChainModal: (() => void) | undefined;
  openConnectModal: (() => void) | undefined;
  router: NextRouter;
  client: LitNodeClient;
  t: TFunction<"account", undefined>;
};

export type OrderProps = {
  order: Order;
  chain: number | undefined;
  openChainModal: (() => void) | undefined;
  orderOpen: boolean[];
  setOrderOpen: (e: boolean[]) => void;
  index: number;
  handleDecryptFulfillment: (order: Order) => Promise<void>;
  decryptLoading: boolean[];
  connected: boolean;
  t: TFunction<"account", undefined>
};

export type InformationType = {
  address: string;
  city: string;
  contact: string;
  name: string;
  state: string;
  zip: string;
  country: string;
  sizes: string[];
  collectionIds: string[];
  collectionAmounts: string[];
};

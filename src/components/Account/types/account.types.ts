import { Profile } from "@/components/Common/types/generated";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { AnyAction, Dispatch } from "redux";
import { PKPSig } from "../../../../redux/reducers/currentPKPSlice";
import { NextRouter } from "next/router";
import { AccessControlConditions } from "@lit-protocol/types";

export interface Order {
  orderId: string;
  subOrderIds: string[];
  fulfillerIds: string[];
  prices: string[];
  pkpTokenId: string;
  totalPrice: string;
  transactionHash: string;
  fulfillmentInformation: {
    ciphertext: string;
    dataToEncryptHash: string;
    accessControlConditions: AccessControlConditions | undefined;
    decryptedFulfillment:
      | {
          address: string;
          city: string;
          contact: string;
          name: string;
          state: string;
          zip: string;
          country: string;
          sizes: string[];
          colors: string[];
          collectionIds: string[];
          collectionAmounts: string[];
        }
      | undefined;
  };
  buyer: string;
  sinPKP: boolean;
  blockTimestamp: string;
  subOrderStatuses: string[];
  subOrderIsFulfilled: boolean[];
  message: {
    ciphertext: string;
    dataToEncryptHash: string;
    accessControlConditions: AccessControlConditions | undefined;
  }[];
  decryptedMessage: {
    message: string;
    date: string;
  }[];
  orderStatusTimestamp: string;
  blockNumber: string;
  chosenAddress: string;
  collectionId: string;
  collectionDetails: {
    name: string;
    prices: string[];
    uri: {
      image: string[];
      prompt: string;
      tags: string[];
      category: string;
      profile: Profile;
      chromadinCollectionName?: string;
    };
    soldTokens: string[];
    noLimit: boolean;
    collectionId: string;
    tokenIds: string[];
    fulfillerAddress: string;
    fulfillerId: string;
  }[];
}

export type AllOrdersProps = {
  connected: boolean;
  ordersLoading: boolean;
  allOrders: Order[];
  orderOpen: boolean[];
  allSubscriptions: Subscription | undefined;
  setOrderOpen: (e: boolean[]) => void;
  handleDecryptFulfillment: (order: Order) => Promise<void>;
  decryptLoading: boolean[];
  dispatch: Dispatch<AnyAction>;
  updateFulfillmentInformation: (index: number) => Promise<void>;
  updatedInformation: InformationType[];
  setUpdatedInformation: (e: InformationType[]) => void;
  updateLoading: boolean[];
  decryptMessageLoading: boolean[];
  handleDecryptMessage: (order: Order) => Promise<void>;
  chain: number | undefined;
  openChainModal: (() => void) | undefined;
  connectedPKP: PKPSig | undefined;
  subscriptionsLoading: boolean;
  router: NextRouter;
  client: LitNodeClient;
  subscriptionInfo: string | undefined;
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
  updateFulfillmentInformation: (index: number) => Promise<void>;
  updatedInformation: InformationType[];
  setUpdatedInformation: (e: InformationType[]) => void;
  updateLoading: boolean[];
  decryptMessageLoading: boolean[];
  handleDecryptMessage: (order: Order) => Promise<void>;
  connected: boolean;
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

export interface Subscription {
  subscriberId: string;
  subscribedTimestamp: string;
  unSubscribedTimestamp: string;
  resubscribedTimestamp: string;
  isSubscribed: boolean;
  tokenId: string;
  transactionHash: string;
}

export type SubscribedProps = {
  subscription: Subscription;
  client: LitNodeClient;
  currentPKP: PKPSig | undefined;
  subscriptionInfo: string | undefined;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
};

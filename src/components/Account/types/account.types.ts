import { AnyAction, Dispatch } from "redux";

export interface Order {
  orderId: string;
  subOrderIds: string[];
  fulfillerIds: string[];
  prices: string[];
  totalPrice: string;
  transactionHash: string;
  fulfillmentInformation: {
    encryptedString: number[];
    encryptedSymmetricKey: string;
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
    encryptedString: number[];
    encryptedSymmetricKey: string;
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
      image: string;
      prompt: string;
      tags: string;
      category: string;
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
  openConnectModal: (() => void) | undefined;
  connected: boolean;
  ordersLoading: boolean;
  allOrders: Order[];
  orderOpen: boolean[];
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
};

export type OrderProps = {
  order: Order;
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

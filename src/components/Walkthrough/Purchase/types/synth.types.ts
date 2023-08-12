import { CartItem } from "@/components/Common/types/common.types";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { AnyAction, Dispatch as DispatchRedux } from "redux";

export type PurchaseProps = {
  dispatch: DispatchRedux<AnyAction>;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  cartItems: CartItem[];
  signInLoading: boolean;
  openConnectModal: (() => void) | undefined;
  address: `0x${string}` | undefined;
  chain: number | undefined;
  openChainModal: (() => void) | undefined;
};

export type GridProps = {
  dispatch: Dispatch<AnyAction>;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  cartItems: CartItem[];
  signInLoading: boolean;
  openConnectModal: (() => void) | undefined;
  address: `0x${string}` | undefined;
  fulfillmentDetails: {
    name: string;
    contact: string;
    address: string;
    zip: string;
    city: string;
    state: string;
    country: string;
  };
  connectedPKP: any;
  chain: number | undefined;
  openChainModal: (() => void) | undefined;
};

export type CheckoutProps = {
  signInLoading: boolean;
  openConnectModal: (() => void) | undefined;
  chain: number | undefined;
  openChainModal: (() => void) | undefined;
  address: `0x${string}` | undefined;
  paymentType: string;
  cartItems: CartItem[];
  setCartItem: (e: CartItem) => void;
  cartItem: CartItem | undefined;
  handleCheckoutCrypto: () => Promise<void>;
  handleCheckoutFiat: () => Promise<void>;
  cryptoCheckoutLoading: boolean;
  fiatCheckoutLoading: boolean;
  dispatch: Dispatch<AnyAction>;
  setCheckoutCurrency: (e: string) => void;
  checkoutCurrency: string;
  fulfillmentDetails: {
    name: string;
    contact: string;
    address: string;
    zip: string;
    city: string;
    state: string;
    country: string;
  };
  approved: boolean;
  handleApproveSpend: () => Promise<void>;
  oracleValue: number;
  encryptFulfillerInformation: () => Promise<void>;
  encryptedInformation: string[] | undefined;
  connectedPKP: any;
};

export type CryptoProps = {
  signInLoading: boolean;
  openConnectModal: (() => void) | undefined;
  address: `0x${string}` | undefined;
  handleCheckoutCrypto?: () => Promise<void>;
  cryptoCheckoutLoading?: boolean;
  approved?: boolean;
  handleApproveSpend?: () => Promise<void>;
  cartItems: CartItem[];
  dispatch: Dispatch<AnyAction>;
  connectedPKP: any;
  chain: number | undefined;
  openChainModal: (() => void) | undefined;
};

export type FiatProps = {
  handleCheckoutFiat: () => Promise<void>;
  fiatCheckoutLoading: boolean;
  cartItems: CartItem[];
  encryptFulfillerInformation: () => Promise<void>;
  encryptedInformation: string[] | undefined;
  connectedPKP: any;
  dispatch: Dispatch<AnyAction>;
};

export type ItemsProps = {
  cartItems: CartItem[];
  cartItem: CartItem | undefined;
  paymentType: string;
  dispatch: Dispatch<AnyAction>;
  checkoutCurrency: string;
  setCartItem: (e: CartItem) => void;
};

export type ShippingInfoProps = {
  fulfillmentDetails: {
    name: string;
    contact: string;
    address: string;
    zip: string;
    city: string;
    state: string;
    country: string;
  };
  dispatch: Dispatch<AnyAction>;
};

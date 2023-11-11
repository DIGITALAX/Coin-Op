import { CartItem } from "@/components/Common/types/common.types";
import { MutableRefObject } from "react";
import { AnyAction, Dispatch } from "redux";
import { Details } from "../../../../../redux/reducers/fulfillmentDetailsSlice";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { PublicClient } from "viem";
import { PKPSig } from "../../../../../redux/reducers/currentPKPSlice";

export type PurchaseProps = {
  dispatch: Dispatch<AnyAction>;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  cartItems: CartItem[];
  clientSecret: string | undefined;
  signInLoading: boolean;
  openConnectModal: (() => void) | undefined;
  address: `0x${string}` | undefined;
  chain: number | undefined;
  openChainModal: (() => void) | undefined;
  client: LitNodeClient;
  publicClient: PublicClient;
  paymentType: string;
  encryptedInformation: string[] | undefined;
  connectedPKP: PKPSig | undefined;
  fulfillmentDetails: Details;
};

export type GridProps = {
  dispatch: Dispatch<AnyAction>;
  client: LitNodeClient;
  publicClient: PublicClient;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  cartItems: CartItem[];
  signInLoading: boolean;
  openConnectModal: (() => void) | undefined;
  address: `0x${string}` | undefined;
  fulfillmentDetails: Details;
  connectedPKP: any;
  chain: number | undefined;
  openChainModal: (() => void) | undefined;
  paymentType: string;
  encryptedInformation: string[] | undefined;
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
  fulfillmentDetails: Details;
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
  oracleValue: number;
};

export type ShippingInfoProps = {
  fulfillmentDetails: Details;
  dispatch: Dispatch<AnyAction>;
};

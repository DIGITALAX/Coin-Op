import {
  CartItem,
  Details,
  OracleData,
} from "@/components/Common/types/common.types";
import { Profile } from "@/components/Common/types/generated";
import { MutableRefObject, SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";

export type PurchaseProps = {
  dispatch: Dispatch<AnyAction>;
  lensConnected: Profile | undefined;
  handleLensSignIn: () => Promise<void>;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  cartItems: CartItem[];
  setEncrypted: (
    e: SetStateAction<
      | {
          pubId: string;
          data: string;
        }[]
      | undefined
    >
  ) => void;
  signInLoading: boolean;
  openConnectModal: (() => void) | undefined;
  address: `0x${string}` | undefined;
  chain: number | undefined;
  openChainModal: (() => void) | undefined;
  fulfillmentDetails: Details;
  openCountryDropDown: boolean;
  setOpenCountryDropDown: (e: SetStateAction<boolean>) => void;
  encrypted:
    | {
        pubId: string;
        data: string;
      }[]
    | undefined;
  handleCheckoutCrypto: () => Promise<void>;
  cryptoCheckoutLoading: boolean;
  approved: boolean;
  handleApproveSpend: () => Promise<void>;
  setCheckoutCurrency: (e: string) => void;
  checkoutCurrency: string;
  oracleValue: OracleData[];
  cartItem: CartItem | undefined;
  setCartItem: (e: CartItem) => void;
  setFulfillmentDetails: (e: SetStateAction<Details>) => void;
  encryptFulfillment: () => Promise<void>;
  startIndex: number;
  setStartIndex: (e: SetStateAction<number>) => void;
};

export type GridProps = {
  dispatch: Dispatch<AnyAction>;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  cartItems: CartItem[];
  setEncrypted: (
    e: SetStateAction<
      | {
          pubId: string;
          data: string;
        }[]
      | undefined
    >
  ) => void;
  lensConnected: Profile | undefined;
  handleLensSignIn: () => Promise<void>;
  signInLoading: boolean;
  openConnectModal: (() => void) | undefined;
  startIndex: number;
  setStartIndex: (e: SetStateAction<number>) => void;
  address: `0x${string}` | undefined;
  openCountryDropDown: boolean;
  setOpenCountryDropDown: (e: SetStateAction<boolean>) => void;
  encrypted:
    | {
        pubId: string;
        data: string;
      }[]
    | undefined;
  fulfillmentDetails: Details;
  chain: number | undefined;
  openChainModal: (() => void) | undefined;
  handleCheckoutCrypto: () => Promise<void>;
  cryptoCheckoutLoading: boolean;
  approved: boolean;
  handleApproveSpend: () => Promise<void>;
  setCheckoutCurrency: (e: string) => void;
  checkoutCurrency: string;
  encryptFulfillment: () => Promise<void>;
  oracleValue: OracleData[];
  cartItem: CartItem | undefined;
  setCartItem: (e: CartItem) => void;
  setFulfillmentDetails: (e: SetStateAction<Details>) => void;
};

export type CheckoutProps = {
  signInLoading: boolean;
  openConnectModal: (() => void) | undefined;
  chain: number | undefined;
  openChainModal: (() => void) | undefined;
  address: `0x${string}` | undefined;
  cartItems: CartItem[];
  setCartItem: (e: CartItem) => void;
  cartItem: CartItem | undefined;
  handleCheckoutCrypto: () => Promise<void>;
  cryptoCheckoutLoading: boolean;
  dispatch: Dispatch<AnyAction>;
  setCheckoutCurrency: (e: string) => void;
  checkoutCurrency: string;
  fulfillmentDetails: Details;
  approved: boolean;
  handleApproveSpend: () => Promise<void>;
  oracleValue: OracleData[];
  openCountryDropDown: boolean;
  setOpenCountryDropDown: (e: SetStateAction<boolean>) => void;
  encrypted:
    | {
        pubId: string;
        data: string;
      }[]
    | undefined;
  setFulfillmentDetails: (e: SetStateAction<Details>) => void;
  encryptFulfillment: () => Promise<void>;
  lensConnected: Profile | undefined;
  handleLensSignIn: () => Promise<void>;
  setEncrypted: (
    e: SetStateAction<
      | {
          pubId: string;
          data: string;
        }[]
      | undefined
    >
  ) => void;
};

export type CryptoProps = {
  signInLoading: boolean;
  encrypted:
    | {
        pubId: string;
        data: string;
      }[]
    | undefined;
  openConnectModal: (() => void) | undefined;
  address: `0x${string}` | undefined;
  handleCheckoutCrypto?: () => Promise<void>;
  cryptoCheckoutLoading?: boolean;
  encryptFulfillment: () => Promise<void>;
  approved?: boolean;
  handleApproveSpend?: () => Promise<void>;
  cartItems: CartItem[];
  chain: number | undefined;
  openChainModal: (() => void) | undefined;
  lensConnected: Profile | undefined;
  handleLensSignIn: () => Promise<void>;
};

export type ItemsProps = {
  cartItems: CartItem[];
  cartItem: CartItem | undefined;
  dispatch: Dispatch<AnyAction>;
  checkoutCurrency: string;
  setCartItem: (e: CartItem) => void;
  oracleValue: OracleData[];
  setEncrypted: (
    e: SetStateAction<
      | {
          pubId: string;
          data: string;
        }[]
      | undefined
    >
  ) => void;
};

export type ShippingInfoProps = {
  fulfillmentDetails: Details;
  setFulfillmentDetails: (e: SetStateAction<Details>) => void;
  openCountryDropDown: boolean;
  setOpenCountryDropDown: (e: SetStateAction<boolean>) => void;
  setEncrypted: (
    e: SetStateAction<
      | {
          pubId: string;
          data: string;
        }[]
      | undefined
    >
  ) => void;
  encrypted:
    | {
        pubId: string;
        data: string;
      }[]
    | undefined;
};

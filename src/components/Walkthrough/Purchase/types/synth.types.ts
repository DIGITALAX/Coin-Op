import { CartItem, PreRoll } from "@/components/Common/types/common.types";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { AnyAction, Dispatch as DispatchRedux } from "redux";

export type PurchaseProps = {
  dispatch: DispatchRedux<AnyAction>;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  cartItems: CartItem[];
  cartItem: CartItem | undefined;
  setCartItem: (e: CartItem | undefined) => void;
  startIndex: number;
  setStartIndex: Dispatch<SetStateAction<number>>;
  signInLoading: boolean;
  openConnectModal: (() => void) | undefined;
  address: `0x${string}` | undefined;
  paymentType: string;
  setPaymentType: (e: string) => void;
  handleCheckoutCrypto: () => Promise<void>;
  handleCheckoutFiat: () => Promise<void>;
  cryptoCheckoutLoading: boolean;
  fiatCheckoutLoading: boolean;
  setCheckoutCurrency: (e: string) => void;
  checkoutCurrency: string;
};

export type GridProps = {
  dispatch: Dispatch<AnyAction>;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  cartItems: CartItem[];
  cartItem: CartItem | undefined;
  setCartItem: (e: CartItem | undefined) => void;
  startIndex: number;
  setStartIndex: Dispatch<SetStateAction<number>>;
  signInLoading: boolean;
  openConnectModal: (() => void) | undefined;
  address: `0x${string}` | undefined;
  paymentType: string;
  setPaymentType: (e: string) => void;
  handleCheckoutCrypto: () => Promise<void>;
  handleCheckoutFiat: () => Promise<void>;
  cryptoCheckoutLoading: boolean;
  fiatCheckoutLoading: boolean;
  setCheckoutCurrency: (e: string) => void;
  checkoutCurrency: string;
};

export type CheckoutProps = {
  signInLoading: boolean;
  openConnectModal: (() => void) | undefined;
  address: `0x${string}` | undefined;
  paymentType: string;
  setPaymentType: (e: string) => void;
  cartItems: CartItem[];
  cartItem: CartItem | undefined;
  handleCheckoutCrypto: () => Promise<void>;
  handleCheckoutFiat: () => Promise<void>;
  cryptoCheckoutLoading: boolean;
  fiatCheckoutLoading: boolean;
  dispatch: Dispatch<AnyAction>;
  setCheckoutCurrency: (e: string) => void;
  checkoutCurrency: string;
};

export type CryptoProps = {
  signInLoading: boolean;
  openConnectModal: (() => void) | undefined;
  address: `0x${string}` | undefined;
  handleCheckoutCrypto: () => Promise<void>;
  cryptoCheckoutLoading: boolean;
};

export type FiatProps = {
  handleCheckoutFiat: () => Promise<void>;
  fiatCheckoutLoading: boolean;
};

export type ItemsProps = {
  cartItems: CartItem[];
  cartItem: CartItem | undefined;
  paymentType: string;
  dispatch: Dispatch<AnyAction>;
  checkoutCurrency: string;
};

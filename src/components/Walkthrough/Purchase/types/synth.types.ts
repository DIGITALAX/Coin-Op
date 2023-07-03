import { PreRoll } from "@/components/Common/types/common.types";
import { Profile } from "@/components/Common/types/lens.types";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { AnyAction, Dispatch as DispatchRedux } from "redux";

export type PurchaseProps = {
  dispatch: DispatchRedux<AnyAction>;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  cartItems: PreRoll[];
  cartItem: PreRoll | undefined;
  setCartItem: (e: PreRoll | undefined) => void;
  startIndex: number;
  setStartIndex: Dispatch<SetStateAction<number>>;
  signInLoading: boolean;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  profile: Profile | undefined;
  address: `0x${string}` | undefined;
  paymentType: string;
  setPaymentType: (e: string) => void;
};

export type GridProps = {
  dispatch: Dispatch<AnyAction>;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  cartItems: PreRoll[];
  cartItem: PreRoll | undefined;
  setCartItem: (e: PreRoll | undefined) => void;
  startIndex: number;
  setStartIndex: Dispatch<SetStateAction<number>>;
  signInLoading: boolean;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  profile: Profile | undefined;
  address: `0x${string}` | undefined;
  paymentType: string;
  setPaymentType: (e: string) => void;
};

export type CheckoutProps = {
  signInLoading: boolean;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  profile: Profile | undefined;
  address: `0x${string}` | undefined;
  paymentType: string;
  setPaymentType: (e: string) => void;
};

export type CryptoProps = {
  signInLoading: boolean;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  profile: Profile | undefined;
  address: `0x${string}` | undefined;
}

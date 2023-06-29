import { PreRoll } from "@/components/Common/types/common.types";
import { MutableRefObject } from "react";
import { AnyAction, Dispatch } from "redux";

export type PurchaseProps = {
  dispatch: Dispatch<AnyAction>;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  cartItems: PreRoll[];
};

export type GridProps = {
  dispatch: Dispatch<AnyAction>;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
};

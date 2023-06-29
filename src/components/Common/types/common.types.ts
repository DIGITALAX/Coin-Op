import { Template } from "@/components/Walkthrough/Format/types/format.types";
import { NextRouter } from "next/router";
import { MutableRefObject } from "react";
import { AnyAction, Dispatch } from "redux";

export type PageContainerProps = {
  dispatch: Dispatch<AnyAction>;
  template: Template;
  synthLayer: string[];
  synthLayerSelected: string;
  shareSet: boolean;
  setShareSet: (e: boolean) => void;
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  cartItems: PreRoll[];
};

export enum PrintType {
  Print = "print",
  Hoodie = "hoodie",
  Stickers = "stickers",
  Shirt = "shirt",
}

export interface PreRoll {
  name: string;
  image: string;
  colors: string[];
  price: number;
  type: string;
  bgColor: string;
  chosenColor: string;
  tags: string[];
}

export type PreRollsProps = {
  preRolls: {
    left: PreRoll[];
    right: PreRoll[];
  };
  dispatch: Dispatch<AnyAction>;
  cartItems: PreRoll[];
  left?: boolean;
  right?: boolean;
};

export type PreRollProps = {
  preRoll: PreRoll;
  dispatch: Dispatch<AnyAction>;
  cartItems: PreRoll[];
  preRolls: {
    left: PreRoll[];
    right: PreRoll[];
  };
  left?: boolean;
  right?: boolean;
};

export type PrintTagProps = {
  backgroundColor: string;
  type: string;
};

export type ColorChoiceProps = {
  dispatch: Dispatch<AnyAction>;
  preRolls: {
    left: PreRoll[];
    right: PreRoll[];
  };
  preRoll: PreRoll;
  left?: boolean;
  right?: boolean;
};

export type SearchBoxProps = {
  promptSearch: PreRoll;
  handlePromptChoose: (e: PreRoll) => void;
};

export type RollSearchProps = {
  rollSearch: PreRoll[];
  handleRollSearch: () => Promise<void>;
  prompt: string;
  setPrompt: (e: string) => void;
  handlePromptChoose: (e: PreRoll) => void;
  router: NextRouter;
};

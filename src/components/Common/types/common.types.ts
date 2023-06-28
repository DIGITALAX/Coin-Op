import { Template } from "@/components/Walkthrough/Format/types/format.types";
import { AnyAction, Dispatch } from "redux";

export type PageSwitchProps = {
  pageSwitcher: string;
};

export type PageContainerProps = {
  pageSwitcher: string;
};

export enum PrintType {
  Print = "print",
  Hoodie = "hoodie",
  Stickers = "stickers",
  Shirt = "shirt",
}

export interface PreRoll {
  image: string;
  colors: string[];
  price: number;
  type: string;
  bgColor: string;
  chosenColor: string;
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
  promptSearch: RollSearch;
};

export interface RollSearch {
  tags: string;
  template: Template;
}

export type RollSearchProps = {
  rollSearch: RollSearch[];
  handleRollSearch: () => void;
  prompt: string;
  setPrompt: (e: string) => void;
};

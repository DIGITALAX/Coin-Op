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
  type: PrintType;
  bgColor: string;
  chosenColor: string;
}

export type PreRollsProps = {
  preRoll: PreRoll[];
};

export type PreRollProps = {
  preRoll: PreRoll;
};

export type PrintTagProps = {
  backgroundColor: string;
  type: PrintType;
};

export type ColorChoiceProps = {
  colors: string[];
  chosenColor: string;
};

export type SearchBoxProps = {
  promptSearch: RollSearch;
};

export interface RollSearch {
  tags: string;
  image: string;
  name: string;
}

export type RollSearchProps = {
  rollSearch: RollSearch[];
  handleRollSearch: () => void;
  prompt: string;
  setPrompt: (e: string) => void;
};

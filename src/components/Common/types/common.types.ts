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
  colors: string[]
}
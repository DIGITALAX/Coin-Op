import FGODesignersABI from "./core/FGODesigners.json";
import ERC20ABI from "./core/ERC20.json";

import FGOTemplateChildABI from "./children/FGOTemplateChild.json";
import FGOChildABI from "./children/FGOChild.json";
import FGOParentABI from "./parent/FGOParent.json";

export const ABIS = {
  FGODesigners: FGODesignersABI,
  ERC20: ERC20ABI,
  FGOTemplateChild: FGOTemplateChildABI,
  FGOChild: FGOChildABI,
  FGOParent: FGOParentABI,
} as const;

export const getABI = (contractName: keyof typeof ABIS) => {
  return ABIS[contractName];
};

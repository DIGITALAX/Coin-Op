import { RollSearch } from "@/components/Common/types/common.types";

export type HeaderProps = {
  handleRollSearch: () => void;
  rollSearch: RollSearch[];
  prompt: string;
  setPrompt: (e: string) => void;
};

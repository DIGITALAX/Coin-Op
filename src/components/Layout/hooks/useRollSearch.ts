import { RollSearch } from "@/components/Common/types/common.types";
import { useState } from "react";

const useRollSearch = () => {
  const [rollSearch, setRollSearch] = useState<RollSearch[]>([]);
  const [prompt, setPrompt] = useState<string>("");

  const handleRollSearch = () => {
    setRollSearch([]);
  };

  return { rollSearch, handleRollSearch, prompt, setPrompt };
};

export default useRollSearch;

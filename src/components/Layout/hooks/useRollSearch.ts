import { PreRoll } from "@/components/Common/types/common.types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useRouter } from "next/router";
import { setRollSearch } from "../../../../redux/reducers/rollSearchSlice";

const useRollSearch = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [prompt, setPrompt] = useState<string>("");
  const preRolls = useSelector((state: RootState) => state.app.preRollReducer);

  const handleRollSearch = () => {
    const searchResults: PreRoll[] = [];

    [...preRolls.left, ...preRolls.right].forEach((preRoll) => {
      preRoll.tags?.forEach((tag) => {
        if (
          tag.toLowerCase().includes(prompt.toLowerCase()) ||
          prompt.toLowerCase().includes(tag.toLowerCase()) ||
          (tag.length >= 3 &&
            tag.toLowerCase().includes(prompt.slice(0, 3).toLowerCase()))
        ) {
          searchResults.push(preRoll);
        }
      });
    });

    dispatch(setRollSearch(searchResults));
  };

  const handlePromptChoose = (preRoll: PreRoll) => {
    router.push(`/preroll/${preRoll.name}`);
  };

  return {
    handleRollSearch,
    prompt,
    setPrompt,
    handlePromptChoose,
  };
};

export default useRollSearch;

import { PreRoll } from "@/components/Common/types/common.types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useRouter } from "next/router";
import { setRollSearch } from "../../../../redux/reducers/rollSearchSlice";
import { initializeAlgolia } from "../../../../lib/algolia/client";
import { setAlgolia } from "../../../../redux/reducers/algoliaSlice";

const useRollSearch = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [prompt, setPrompt] = useState<string>("");
  const preRolls = useSelector((state: RootState) => state.app.preRollReducer);
  const algolia = useSelector(
    (state: RootState) => state.app.algoliaReducer.value
  );

  const handleRollSearch = async () => {
    if (!algolia) return;
    const searchResults: PreRoll[] = [];

    const { hits } = await algolia.search(prompt);
    console.log({ hits });

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

  useEffect(() => {
    if (!algolia) {
      const index = initializeAlgolia();
      dispatch(setAlgolia(index));
    }
  }, []);

  return {
    handleRollSearch,
    prompt,
    setPrompt,
    handlePromptChoose,
  };
};

export default useRollSearch;

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

    const { hits } = await algolia.search(prompt);

    dispatch(setRollSearch(hits.length > 0 ? hits : (undefined as any)));
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

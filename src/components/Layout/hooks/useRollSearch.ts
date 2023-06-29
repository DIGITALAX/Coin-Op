import { PreRoll } from "@/components/Common/types/common.types";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useRouter } from "next/router";
import { setRollSearch } from "../../../../redux/reducers/rollSearchSlice";
import { initializeAlgolia } from "../../../../lib/algolia/client";
import { setAlgolia } from "../../../../redux/reducers/algoliaSlice";
import { ScrollContext } from "@/pages/_app";

const useRollSearch = () => {
  const scrollRef = useContext(ScrollContext);
  const dispatch = useDispatch();
  const router = useRouter();
  const [prompt, setPrompt] = useState<string>("");
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

  const scrollToCheckOut = () => {
    if (!scrollRef || !scrollRef?.current) return;

    scrollRef?.current.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => {
      scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
    }, 500);
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
    scrollToCheckOut,
  };
};

export default useRollSearch;

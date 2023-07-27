import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { useRef, useState } from "react";
import { setCompletedSynths } from "../../../../../redux/reducers/completedSynthsSlice";

const useSynth = () => {
  const dispatch = useDispatch();
  const compositeRef = useRef<HTMLDivElement>(null);
  const synthConfig = useSelector(
    (state: RootState) => state.app.synthConfigReducer
  );
  const [synthLoading, setSynthLoading] = useState<boolean>(false);
  const presets: string[] = [
    "none",
    "abstract",
    "anime",
    "synthwave",
    "street art",
    "dark fantasy",
    "floral",
    "surreal",
    "pop art",
    "portrait",
    "mix",
    "daily special",
  ];

  const handleSynth = async () => {
    setSynthLoading(true);
    try {
      dispatch(setCompletedSynths([]));
    } catch (err: any) {
      console.error(err.message);
    }
    setSynthLoading(false);
  };

  const scrollToComposite = () => {
    if (!compositeRef || !compositeRef?.current) return;

    compositeRef?.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      compositeRef.current!.scrollTop = compositeRef.current!.scrollHeight;
    }, 500);
  };

  return {
    handleSynth,
    synthLoading,
    presets,
    scrollToComposite,
    compositeRef,
  };
};

export default useSynth;

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { useRef, useState } from "react";
import { setCompletedSynths } from "../../../../../redux/reducers/completedSynthsSlice";
import { setSynthLoading } from "../../../../../redux/reducers/synthLoadingSlice";

const useSynth = () => {
  const dispatch = useDispatch();
  const compositeRef = useRef<HTMLDivElement>(null);
  const synthConfig = useSelector(
    (state: RootState) => state.app.synthConfigReducer
  );
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
    dispatch(setSynthLoading(true));
    try {
      dispatch(setCompletedSynths([]));
    } catch (err: any) {
      console.error(err.message);
    }
    dispatch(setSynthLoading(false));
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
    presets,
    scrollToComposite,
    compositeRef,
  };
};

export default useSynth;

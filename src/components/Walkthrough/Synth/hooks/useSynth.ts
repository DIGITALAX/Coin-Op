import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { useState } from "react";

const useSynth = () => {
  const dispatch = useDispatch();
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
      dispatch(setCompletedSynths());
    } catch (err: any) {
      console.error(err.message);
    }
    setSynthLoading(false);
  };

  return { handleSynth, synthLoading, presets };
};

export default useSynth;

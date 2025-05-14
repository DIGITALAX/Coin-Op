import { ScrollContext, SynthContext } from "@/app/providers";
import { useContext, useEffect, useState } from "react";
import { getTemplatesByPrintType } from "../../../../../graphql/queries/getTemplates";
import { printTypeToNumber } from "@/app/lib/constants";

const useLayer = () => {
  const scrollContext = useContext(ScrollContext);
  const synthContext = useContext(SynthContext);
  const [layersLoading, setLayersLoading] = useState<boolean>(false);

  const getLayers = async () => {
    setLayersLoading(true);
    try {
      const data = await getTemplatesByPrintType(
        Number(printTypeToNumber[synthContext?.current?.template?.type!])
      );

      synthContext?.setCurrent((prev) => ({
        ...prev,
        printLayers: data?.data?.parentCreateds,
        synth: data?.data?.parentCreateds[0],
        layer: data?.data?.parentCreateds[0]?.children?.[0],
      }));
    } catch (err: any) {
      console.error(err.message);
    }
    setLayersLoading(false);
  };

  const scrollToPreroll = () => {
    if (!scrollContext?.prerollRef || !scrollContext?.prerollRef?.current)
      return;

    scrollContext?.prerollRef?.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      scrollContext.prerollRef.current!.scrollTop =
        scrollContext?.prerollRef.current!.scrollHeight;
    }, 500);
  };

  useEffect(() => {
    if (synthContext?.current?.template) {
      getLayers();
    }
  }, [synthContext?.current?.template]);

  return {
    layersLoading,
    scrollToPreroll,
  };
};

export default useLayer;

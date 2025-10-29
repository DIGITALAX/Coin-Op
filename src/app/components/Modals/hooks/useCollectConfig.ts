import { ModalContext } from "@/app/providers";
import { useContext, useEffect, useState } from "react";

const useCollectConfig = (dict: any) => {
  const contexto = useContext(ModalContext);
  const [drops, setDrops] = useState<{
    award: string;
    whoCollectsOpen: boolean;
    creatorAwardOpen: boolean;
    currencyOpen: boolean;
    editionOpen: boolean;
    edition: string;
    timeOpen: boolean;
    time: string;
  }>({
    award: contexto?.postCollect?.type?.payToCollect?.amount
      ? dict?.Common.yes
      : "No",
    whoCollectsOpen: false,
    creatorAwardOpen: false,
    currencyOpen: false,
    editionOpen: false,
    edition: contexto?.postCollect?.type?.collectLimit ? dict?.Common.yes : "No",
    timeOpen: false,
    time: contexto?.postCollect?.type?.endsAt ? dict?.Common.yes : "No",
  });

  useEffect(() => {
    if (contexto?.postCollect?.type) {
      setDrops({
        award: contexto?.postCollect?.type?.payToCollect?.amount
          ? dict?.Common.yes
          : "No",
        whoCollectsOpen: false,
        creatorAwardOpen: false,
        currencyOpen: false,
        editionOpen: false,
        edition: contexto?.postCollect?.type?.collectLimit
          ? dict?.Common.yes
          : "No",
        timeOpen: false,
        time: contexto?.postCollect?.type?.endsAt ? dict?.Common.yes : "No",
      });
    }
  }, [contexto?.postCollect?.type]);

  return {
    drops,
    setDrops,
  };
};

export default useCollectConfig;

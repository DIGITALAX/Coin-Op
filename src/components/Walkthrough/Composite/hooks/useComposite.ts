import { useState } from "react";

const useComposite = () => {
  const [shareSet, setShareSet] = useState<boolean>(false);

  const [models, setModels] = useState<string[]>([]);

  return {
    setShareSet,
    shareSet,
    models,
  };
};

export default useComposite;

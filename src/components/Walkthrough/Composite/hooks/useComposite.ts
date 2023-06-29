import { useState } from "react";

const useComposite = () => {
  const [shareSet, setShareSet] = useState<boolean>(false);

  return {
    setShareSet,
    shareSet,
  };
};

export default useComposite;

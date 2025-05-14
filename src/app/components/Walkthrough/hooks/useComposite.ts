import { useState } from "react";

const useComposite = () => {
  const [shareSet, setShareSet] = useState<boolean>(false);
  const [models, setModels] = useState<string[]>([
    "QmdsvJQRA5N3119jaNT4rnC3SUhJvfcgB4bpE2ZWCghBVr",
    "QmPzDc6Xv32YttZA8tzo1DhEZfwwtux5Lswr4V6X537kic",
    "QmQrtbXzG3PkQRCiw8KqZwh4G7VPUn1HUfGR88cshUihPH",
    "QmXiskVERSyFYcnTpqxLcHBxfvgWxKXXatBtv6UJDVhFbK",
    "QmeCePtXGKP6f74cMne4HcikKJTyx2SgMLG3xHkgQkvwwz",
  ]);

  return {
    setShareSet,
    shareSet,
    models,
  };
};

export default useComposite;

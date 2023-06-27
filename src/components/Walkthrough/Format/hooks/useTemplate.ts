import { useState } from "react";
import { Template } from "../types/format.types";

const useTemplate = () => {
  const [template, setTemplate] = useState<Template | undefined>();

  const templates: Template[] = [
    {
      name: "",
      type: "",
      image: "",
    },
    {
      name: "",
      type: "",
      image: "",
    },
  ];

  return {
    templates,
    template,
    setTemplate,
  };
};

export default useTemplate;

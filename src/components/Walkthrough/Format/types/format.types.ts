export type GridProps = {
  templates: Template[];
  template: Template | undefined;
  setTemplate: (e: Template) => void;
};

export interface Template {
  name: string;
  type: string;
  image: string;
}

export type FormatProps = {
    templates: Template[];
    template: Template | undefined;
    setTemplate: (e: Template) => void;
  };
  
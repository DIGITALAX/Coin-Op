import { AnyAction, Dispatch } from "redux";

export type GridProps = {
  templates: Template[];
  template: Template | undefined;
  dispatch: Dispatch<AnyAction>;
};

export interface Template {
  name: string;
  type: string;
  image: string;
}

export type FormatProps = {
  templates: Template[];
  template: Template | undefined;
  dispatch: Dispatch<AnyAction>;
};

export type TemplateProps = {
  template: Template | undefined;
  chosenTemplate: Template | undefined;
  height: string;
  dispatch: Dispatch<AnyAction>;
  locked?: boolean;
};

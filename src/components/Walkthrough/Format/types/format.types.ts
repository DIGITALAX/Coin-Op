import { TFunction } from "i18next";
import { NextRouter } from "next/router";
import { AnyAction, Dispatch } from "redux";

export type GridProps = {
  templates: Template[];
  template: Template | undefined;
  dispatch: Dispatch<AnyAction>;
  t: TFunction<"common", undefined>;
  router: NextRouter;
};

export interface Template {
  name: string;
  type: string;
  image: string;
}

export type FormatProps = {
  templates: Template[];
  router: NextRouter;
  template: Template | undefined;
  dispatch: Dispatch<AnyAction>;
  t: TFunction<"common", undefined>;
};

export type TemplateProps = {
  template: Template | undefined;
  chosenTemplate: Template | undefined;
  height: string;
  t: TFunction<"common", undefined>;
  dispatch: Dispatch<AnyAction>;
  locked?: boolean;
};

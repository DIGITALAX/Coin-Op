import { FunctionComponent } from "react";
import { PageContainerProps } from "../types/common.types";
import Purchase from "@/components/Walkthrough/Purchase/modules/Purchase";
import templates from "./../../../../public/items/templates.json";
import layers from "./../../../../public/items/layers.json";
import Format from "@/components/Walkthrough/Format/modules/Format";
import Layer from "@/components/Walkthrough/Layer/modules/Layer";

const PageContainer: FunctionComponent<PageContainerProps> = ({
  dispatch,
  template,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex overflow-y-scroll">
      <div className="relative w-full h-fit flex flex-col gap-5">
        <Format dispatch={dispatch} template={template} templates={templates} />
        <Layer layers={layers} dispatch={dispatch} />
        <Purchase />
      </div>
    </div>
  );
};

export default PageContainer;

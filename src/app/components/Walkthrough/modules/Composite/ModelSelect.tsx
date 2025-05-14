import { FunctionComponent, JSX } from "react";
import Model from "./Model";
import { ModelSelectProps } from "../../types/walkthrough.types";

const ModelSelect: FunctionComponent<ModelSelectProps> = ({
  models,
  dict,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col gap-3 p-4">
      <div className="relative flex justify-start items-start w-fit h-fit font-mana text-white">
        {dict?.Common?.model}
      </div>
      <div
        className="relative h-full flex overflow-x-scroll calc-3 preG:w-calc2 xl:w-calc"
        id="xScroll"
      >
        <div className="relative w-fit h-full flex gap-2">
          {models?.map((model: string, index: number) => {
            return <Model key={index} model={model} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default ModelSelect;

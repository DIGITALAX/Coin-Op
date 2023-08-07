import { FunctionComponent } from "react";
import Model from "./Model";
import { ModelsProps } from "../types/composite.types";

const ModelSelect: FunctionComponent<ModelsProps> = ({
  models,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col gap-3 p-4">
      <div className="relative flex justify-start items-start w-fit h-fit font-mana text-white">
        select model scene:
      </div>
      <div
        className="relative h-full flex overflow-x-scroll"
        style={{ width: "calc(100vw - 20rem - 20rem - 1rem)" }}
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

import { FunctionComponent, JSX } from "react";
import { ModelsProps } from "../../types/walkthrough.types";
import { MODELS } from "@/app/lib/constants";

const Models: FunctionComponent<ModelsProps> = ({
  dict,
  setConfig,
  config,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col items-start justify-start p-2 gap-4 font-mana text-xs text-white">
      <div className="relative w-fit h-fit flex justify-start items-start">
        {dict?.Common?.models}
      </div>
      <div className="relative w-full h-full overflow-y-scroll flex items-start justify-start">
        <div className="inline-flex gap-2 relative w-fit h-fit items-start justify-start flex-wrap">
          {MODELS.map((model: string, index: number) => {
            return (
              <div
                key={index}
                className={`relative w-fit h-fit px-2 py-1 border border-smo rounded-md cursor-pointer hover:bg-azul flex items-center justify-center text-center break-words ${
                  config?.model == model && "bg-azul"
                }`}
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    model,
                  }))
                }
              >
                {model}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Models;

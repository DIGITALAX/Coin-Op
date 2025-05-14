import { FunctionComponent, JSX } from "react";
import { PresetProps } from "../../types/walkthrough.types";
import { STYLE_PRESETS } from "@/app/lib/constants";

const Presets: FunctionComponent<PresetProps> = ({
  dict,
  setConfig,
  config,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col items-start justify-start p-2 gap-4 font-mana text-xs text-white">
      <div className="relative w-fit h-fit flex justify-start items-start">
        {dict?.Common?.pres}
      </div>
      <div className="relative w-full h-full overflow-y-scroll flex items-start justify-start">
        <div className="inline-flex gap-2 relative w-fit h-fit items-start justify-start flex-wrap">
          {STYLE_PRESETS.map((preset: string, index: number) => {
            return (
              <div
                key={index}
                className={`relative w-fit h-fit px-2 py-1 border border-smo rounded-md cursor-pointer hover:bg-azul flex items-center justify-center text-center break-words ${
                  config?.stylePreset == preset && "bg-azul"
                }`}
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    stylePreset: preset,
                  }))
                }
              >
                {preset}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Presets;

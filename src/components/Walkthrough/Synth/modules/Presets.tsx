import { FunctionComponent } from "react";
import { PresetProps } from "../types/synth.types";
import { setSynthConfig } from "../../../../../redux/reducers/synthConfigSlice";

const Presets: FunctionComponent<PresetProps> = ({
  presets,
  dispatch,
  synthConfig,
  t
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col items-start justify-start p-2 gap-4 font-mana text-xs text-white">
      <div className="relative w-fit h-fit flex justify-start items-start">
        {t("pres")}
      </div>
      <div className="relative w-full h-full overflow-y-scroll flex items-start justify-start">
        <div className="inline-flex gap-2 relative w-fit h-fit items-start justify-start flex-wrap">
          {presets.map((preset: string, index: number) => {
            return (
              <div
                key={index}
                className="relative w-fit h-fit px-2 py-1 border border-smo rounded-md cursor-pointer hover:bg-azul flex items-center justify-center text-center break-words"
                onClick={() =>
                  dispatch(
                    setSynthConfig({
                      actionType: synthConfig?.type,
                      actionPrompt: synthConfig?.prompt + " " + preset,
                      actionImage: synthConfig?.image,
                    })
                  )
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

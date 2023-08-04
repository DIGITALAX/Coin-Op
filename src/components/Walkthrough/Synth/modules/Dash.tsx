import { FormEvent, FunctionComponent } from "react";
import { DashProps } from "../types/synth.types";
import { setSynthConfig } from "../../../../../redux/reducers/synthConfigSlice";
import { AiOutlineLoading } from "react-icons/ai";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import Image from "next/legacy/image";

const Dash: FunctionComponent<DashProps> = ({
  synthConfig,
  dispatch,
  handleSynth,
  synthLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-row gap-5 items-start justify-center px-2 py-2.5">
      <div className="relative flex flex-col w-full h-full gap-4 items-start justify-start">
        <div className="relative w-fit h-fit text-white text-sm font-mana">
          modify suggested prompt:
        </div>
        <textarea
          style={{ resize: "none" }}
          placeholder={synthConfig?.prompt}
          value={synthConfig?.prompt}
          className="relative bg-black/10 text-gris font-mana text-sm w-full h-full p-2 border border-smo rounded-md"
          onChange={(e: FormEvent) => {
            !synthLoading &&
              dispatch(
                setSynthConfig({
                  actionType: synthConfig.type,
                  actionPrompt: (e.target as HTMLFormElement).value,
                  actionImage: synthConfig.image,
                })
              );
          }}
        ></textarea>
      </div>
      <div className="relative flex flex-col w-fit h-full gap-5">
        <div className="relative flex flex-row w-full h-fit gap-2 justify-start items-start">
          <div className="relative flex flex-col gap-2 text-white font-mana text-xs">
            <div
              className={`relative w-24 h-fit px-2 py-1.5 ${
                synthConfig?.type === "txt2img" && "bg-azul"
              } border border-smo rounded-md cursor-pointer hover:bg-smo/10 justify-center flex items-center`}
              onClick={() =>
                dispatch(
                  setSynthConfig({
                    actionType: "txt2img",
                    actionPrompt: synthConfig?.prompt,
                    actionImage: synthConfig?.image,
                  })
                )
              }
            >
              txt2img
            </div>
            <div
              className={`relative w-24 h-fit px-2 py-1.5 ${
                synthConfig?.type === "img2img" && "bg-azul"
              } border border-smo rounded-md cursor-pointer hover:bg-smo/10 justify-center flex items-center`}
              onClick={() =>
                dispatch(
                  setSynthConfig({
                    actionType: "img2img",
                    actionPrompt: synthConfig?.prompt,
                    actionImage: synthConfig?.image,
                  })
                )
              }
            >
              img2img
            </div>
          </div>
          <div className="relative flex flex-col gap-2 text-white font-mana items-center justify-center">
            <div
              className={`relative w-fit h-fit justify-center flex items-center text-xs break-words text-center`}
            >
              synth layer
            </div>
            <div
              className={`relative w-20 h-fit px-3 py-1.5 border border-smo rounded-md justify-center flex items-center text-lg leading-3 ${
                (synthConfig?.type === "img2img" && !synthConfig?.image) ||
                synthLoading
                  ? "bg-ama/40"
                  : "bg-eme cursor-pointer active:scale-95"
              }
                
              `}
              onClick={() =>
                (synthConfig?.type === "img2img" && !synthConfig?.image) ||
                synthLoading
                  ? {}
                  : handleSynth()
              }
            >
              <div
                className={`relative w-fit h-3.5 flex items-center justify-center ${
                  synthLoading && "animate-spin"
                }`}
              >
                {synthLoading ? <AiOutlineLoading size={10} /> : `>`}
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-full flex items-center justify-center border border-smo rounded-md">
          <div className="absolute w-full h-full">
            {synthConfig?.image && synthConfig?.type === "img2img" ? (
              <Image
                src={URL.createObjectURL(synthConfig?.image)}
                layout="fill"
                className="rounded-md"
                draggable={false}
              />
            ) : (
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmUCW5nbGVdoQxwaKvyFLRgRTPbD92RNcdt3V913nyC5QS`}
                layout="fill"
                className="rounded-md"
                draggable={false}
              />
            )}
          </div>
          <div
            className={`relative flex flex-row gap-1.5 bg-black p-2 w-4/5 h-fit break-words border border-ama rounded-md justify-center items-center text-center ${
              synthConfig.type !== "img2img" && "opacity-50"
            }`}
          >
            <label
              className={`relative w-4 h-4 items-center justify-center flex ${
                !synthLoading &&
                synthConfig.type === "img2img" &&
                "cursor-pointer active:scale-95"
              } `}
              onChange={(e: FormEvent) => {
                !synthLoading &&
                  synthConfig.type === "img2img" &&
                  dispatch(
                    setSynthConfig({
                      actionType: synthConfig.type,
                      actionPrompt: synthConfig.prompt,
                      actionImage: (e.target as HTMLFormElement).files[0],
                    })
                  );
              }}
            >
              <Image
                draggable={false}
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmRc4iqPS81k9QMaHUcYoS5cPvZPBDErQtXCqPQfepg51w`}
              />
              <input
                type="file"
                accept="image/png"
                hidden
                required
                id="files"
                multiple={true}
                name="images"
                className="caret-transparent"
                disabled={
                  synthLoading || synthConfig.type === "txt2img" ? true : false
                }
              />
            </label>
            <div className="relative w-fit h-fit font-mana text-white text-xs flex justify-center items-center">
              add image inspiration
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dash;

import { FormEvent, FunctionComponent, JSX, useContext, useMemo } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import { SynthContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { usePathname } from "next/navigation";
import { DashProps } from "../../types/walkthrough.types";

const Dash: FunctionComponent<DashProps> = ({
  handleSynth,
  synthLoading,
  config,
  setConfig,
  dict,
}): JSX.Element => {
  const synthContext = useContext(SynthContext);
  const path = usePathname();
  const imageUrl = useMemo(
    () =>
      synthContext?.synthConfig?.image
        ? URL.createObjectURL(synthContext?.synthConfig.image)
        : "",
    [synthContext?.synthConfig?.image]
  );

  return (
    <div className="relative w-full h-full flex flex-col preG:flex-row gap-5 items-start justify-center px-2 py-2.5">
      <div className="relative flex flex-col w-full h-full gap-4 items-start justify-start">
        <div className="relative w-fit h-fit text-white text-sm font-mana">
          {dict?.Common?.modify}
        </div>
        <textarea
          style={{ resize: "none" }}
          placeholder={synthContext?.synthConfig?.prompt}
          value={synthContext?.synthConfig?.prompt}
          className="relative bg-black/10 text-gris font-mana text-sm w-full h-60 preG:h-full  p-2 border border-smo rounded-md"
          onChange={(e: FormEvent) => {
            !synthLoading &&
              synthContext?.setSynthConfig((prev) => ({
                ...prev,
                prompt: (e.target as HTMLFormElement).value,
              }));
          }}
        ></textarea>
      </div>
      <div className="relative flex flex-col w-fit h-full gap-4">
        <div className="relative flex flex-row w-full h-fit gap-2 justify-start items-start">
          <div className="relative flex flex-col gap-2 text-white font-mana text-xs">
            <div
              className={`relative w-24 h-fit px-2 py-1.5 ${
                synthContext?.synthConfig?.type === "txt2img" && "bg-azul"
              } border border-smo rounded-md cursor-pointer hover:bg-smo/10 justify-center flex items-center`}
              onClick={() =>
                synthContext?.setSynthConfig((prev) => ({
                  ...prev,
                  type: "txt2img",
                }))
              }
            >
              txt2img
            </div>
            <div
              className={`relative w-24 h-fit px-2 py-1.5 ${
                synthContext?.synthConfig?.type === "img2img" && "bg-azul"
              } border border-smo rounded-md cursor-pointer hover:bg-smo/10 justify-center flex items-center`}
              onClick={() =>
                synthContext?.setSynthConfig((prev) => ({
                  ...prev,
                  type: "img2img",
                }))
              }
            >
              img2img
            </div>
          </div>
          <div className="relative flex flex-col gap-2 text-white font-mana items-center justify-center">
            <div
              className={`relative w-fit h-fit justify-center flex items-center text-xs break-words text-center ${
                path?.includes("/es/") ? "font-bit" : "font-mana"
              }`}
            >
              {dict?.Common?.capa}
            </div>
            <div
              className={`relative w-20 h-fit px-3 py-1.5 border border-smo rounded-md justify-center flex items-center text-lg leading-3 ${
                (synthContext?.synthConfig?.type === "img2img" &&
                  !synthContext?.synthConfig?.image) ||
                synthLoading
                  ? "bg-ama/40"
                  : "bg-eme cursor-pointer active:scale-95"
              }
                
              `}
              onClick={() =>
                (synthContext?.synthConfig?.type === "img2img" &&
                  !synthContext?.synthConfig?.image) ||
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
            {synthContext?.synthConfig?.image &&
            synthContext?.synthConfig?.type === "img2img" &&
            imageUrl !== "" ? (
              <Image
                src={imageUrl}
                layout="fill"
                className="rounded-md"
                draggable={false}
                objectFit="cover"
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
          <label
            className={`relative flex flex-col gap-1.5 bg-black p-2 w-4/5 h-fit break-words border border-ama rounded-md justify-center items-center text-center ${
              synthContext?.synthConfig.type !== "img2img"
                ? "opacity-50"
                : "cursor-pointer"
            }`}
            onChange={(e: FormEvent) => {
              !synthLoading &&
                synthContext?.synthConfig.type === "img2img" &&
                synthContext?.setSynthConfig((prev) => ({
                  ...prev,
                  image: (e.target as HTMLFormElement).files[0],
                }));
            }}
          >
            <div className="relative w-full h-full flex flex-row gap-1.5 break-words justify-center items-center text-center">
              <div
                className={`relative w-4 h-4 items-center justify-center flex`}
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
                    synthLoading || synthContext?.synthConfig.type === "txt2img"
                      ? true
                      : false
                  }
                />
              </div>
              <div
                className={`relative w-fit h-fit text-white flex justify-center items-center text-xxxs ${path?.includes("/es/") ? "font-bit" : "font-mana"}`}
              >
                {dict?.Common?.inspo}
              </div>
            </div>
            {!synthContext?.canvasExpand && (
              <div
                className={`relative flex items-center justify-center break-words text-xxxs text-white ${
                  path?.includes("/es/") ? "font-bit" : "font-mana"
                }`}
              >
                {dict?.Common?.pat}
              </div>
            )}
          </label>
        </div>
        <div className="relative w-full h-fit flex flex-col gap-1.5">
          <div className="relative w-full h-fit justify-between text-white font-mana flex flex-row break-words text-xxs">
            <div className="relative w-fit h-fit">{dict?.Common?.trace}</div>
            <div className="relative w-fit h-fit">{dict?.Common?.remix}</div>
            <div className="relative w-fit h-fit">{dict?.Common?.free}</div>
          </div>
          <div className="relative flex flex-col w-full h-fit">
            <input
              type="range"
              className="w-full"
              value={config?.controlType}
              max={1}
              min={0}
              step={0.01}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  controlType: Number(e.target.value),
                }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dash;

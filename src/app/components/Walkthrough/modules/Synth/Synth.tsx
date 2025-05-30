import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext, ScrollContext, SynthContext } from "@/app/providers";
import Image from "next/legacy/image";
import { usePathname } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import Presets from "./Presets";
import useSynth from "../../hooks/useSynth";
import Dash from "./Dash";
import dynamic from "next/dynamic";
import CompleteImages from "./CompleteImages";
import useCanvas from "../../hooks/useCanvas";
import Models from "./Models";

const DynamicCanvasComponent = dynamic(() => import("./Canvas"), {
  ssr: false,
});

const Synth: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const scrollContext = useContext(ScrollContext);
  const synthContext = useContext(SynthContext);
  const context = useContext(ModalContext);
  const path = usePathname();
  const {
    scrollToComposite,
    config,
    setConfig,
    synthLoading,
    handleSynth,
    handleDownloadImage,
    synthProgress,
  } = useSynth(dict);
  const {
    canvasRef,
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    newLayersLoading,
    isDragging,
    hex,
    setHex,
    setColorPicker,
    showBottomOptions,
    setShowBottomOptions,
    thickness,
    setThickness,
    brushWidth,
    setBrushWidth,
    setTool,
    colorPicker,
    tool,
    undo,
    redo,
    handleImageAdd,
    handleReset,
    writingRef,
    handleBlur,
    action,
    selectedElement,
    font,
    fontOpen,
    setFont,
    setFontOpen,
    materialBackground,
    materialOpen,
    setMaterialBackground,
    setMaterialOpen,
    history,
    itemClicked,
    setItemClicked,
  } = useCanvas(synthLoading, synthProgress);

  return (
    <div
      className={`relative w-full h-fit flex flex-col`}
      ref={scrollContext?.synthRef}
    >
      <div className="relative w-full h-150 flex flex-col gap-2 items-start justify-start">
        <div className="absolute w-full h-full hidden preG:flex">
          <Image
            alt="copy"
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/QmZibAC5QRhVVNnXUQZaBcWtmYxUoFjCcGMTZcccJK7RXe`}
            draggable={false}
          />
        </div>
        <div
          className={`relative w-full flex h-5/6 px-2 sm:px-7 pt-4 order-1 overflow-y-scroll items-start justify-start`}
        >
          <div
            className={`w-full flex h-full gap-4 synth:gap-8 items-start justify-start justify-center transition-all duration-300 ease-in-out ${
              synthContext?.canvasExpand
                ? "flex-col z-30 bg-opacity-90 backdrop-blur-sm bg-black inset-0 fixed p-2"
                : "flex-col synth:flex-row relative"
            }`}
          >
            <div
              className={`relative items-start justify-start flex gap-3 w-full ${
                synthContext?.canvasExpand
                  ? "flex-row h-52"
                  : "flex-col md:flex-row synth:flex-col synth:h-full h-fit md:h-72 xl:h-72"
              }`}
            >
              <div className="relative w-full h-full flex items-center justify-center rounded-md border border-ama">
                <Dash
                  handleSynth={handleSynth}
                  synthLoading={synthLoading}
                  config={config}
                  setConfig={setConfig}
                  dict={dict}
                />
              </div>
              <div className="relative w-full md:w-60 xl:w-full h-20 md:h-full synth:h-20 flex items-center justify-center rounded-md border border-ama grow">
                <Models config={config} setConfig={setConfig} dict={dict} />
              </div>
              <div className="relative w-full md:w-60 xl:w-full h-52 md:h-full synth:h-52 flex items-center justify-center rounded-md border border-ama grow">
                <Presets config={config} setConfig={setConfig} dict={dict} />
              </div>
            </div>
            <div
              className={`relative w-full h-110 synth:h-full flex flex-col gap-3`}
            >
              {(
                synthContext?.current?.completedSynths?.get(
                  String(synthContext?.current?.layer?.id)
                )?.synths || []
              )?.length > 0 && (
                <CompleteImages
                  handleDownloadImage={handleDownloadImage}
                  synthLoading={synthLoading}
                  itemClicked={itemClicked}
                  setItemClicked={setItemClicked}
                />
              )}
              <DynamicCanvasComponent
                materialBackground={materialBackground}
                setMaterialBackground={setMaterialBackground}
                materialOpen={materialOpen}
                setMaterialOpen={setMaterialOpen}
                font={font}
                setFont={setFont}
                fontOpen={fontOpen}
                setFontOpen={setFontOpen}
                tool={tool}
                action={action}
                synthLoading={synthLoading}
                handleBlur={handleBlur}
                writingRef={writingRef}
                selectedElement={selectedElement}
                canvasRef={canvasRef}
                handleMouseDown={handleMouseDown}
                handleMouseUp={handleMouseUp}
                handleMouseMove={handleMouseMove}
                newLayersLoading={newLayersLoading}
                isDragging={isDragging}
                showBottomOptions={showBottomOptions}
                setShowBottomOptions={setShowBottomOptions}
                colorPicker={colorPicker}
                setColorPicker={setColorPicker}
                hex={hex}
                setHex={setHex}
                setThickness={setThickness}
                thickness={thickness}
                setBrushWidth={setBrushWidth}
                brushWidth={brushWidth}
                setTool={setTool}
                undo={undo}
                redo={redo}
                handleReset={handleReset}
              />
              <div
                className={`w-full flex justify-center items-center gap-3 ${
                  synthContext?.canvasExpand
                    ? `absolute flex-row p-2 h-14 ${
                        (
                          synthContext?.current?.completedSynths?.get(
                            String(synthContext?.current?.layer?.id)
                          )?.synths || []
                        )?.length > 0
                          ? "top-10"
                          : "top-2"
                      }`
                    : "relative h-24 preG:h-10 flex-col preG:flex-row"
                }`}
              >
                <div className="relative w-full h-full flex flex-row items-center justify-start">
                  <div className="relative w-fit h-full items-center justify-start flex flex-row gap-3">
                    {(Number(synthContext?.current?.synth?.children?.length) < 4
                      ? synthContext?.current?.synth?.children
                      : Array(3)
                          .fill(null)
                          .map(
                            (_, index) =>
                              synthContext?.current?.synth?.children?.[
                                (synthContext?.current?.synth?.children
                                  ?.map((child) => child?.id)
                                  ?.indexOf(synthContext?.current?.layer?.id!) +
                                  index) %
                                  synthContext?.current?.synth?.children?.length
                              ]
                          )
                    )?.map((child, index: number) => {
                      return (
                        <div
                          className={`relative w-20 h-full flex flex-row items-center justify-center gap-2 border hover:opacity-70 rounded-lg ${
                            synthContext?.current?.layer?.uri === child?.uri
                              ? "border-white"
                              : "border-ama"
                          } ${!synthLoading && "cursor-pointer"}`}
                          key={index}
                          onClick={() =>
                            !synthLoading &&
                            synthContext?.setCurrent((prev) => ({
                              ...prev,
                              layer: child,
                            }))
                          }
                        >
                          <Image
                            src={`${INFURA_GATEWAY}/ipfs/QmPKU1ck9PLyFchFpe2vzJh3eyxSYij28ixTdRzaHi4E1p`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg absolute"
                            draggable={false}
                          />
                          <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                              src={`${INFURA_GATEWAY}/ipfs/${
                                child?.uri?.split("ipfs://")[1]
                              }`}
                              layout="fill"
                              objectFit="contain"
                              draggable={false}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div
                  className={`relative w-fit h-full flex flex-row items-center justify-center gap-1.5 ${
                    synthContext?.canvasExpand && "right-6"
                  }`}
                >
                  <div
                    className={`relative w-5 h-5 flex items-center justify-center ${
                      !synthLoading && "cursor-pointer active:scale-95"
                    }`}
                  >
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/Qma3jm41B4zYQBxag5sJSmfZ45GNykVb8TX9cE3syLafz2`}
                      layout="fill"
                      draggable={false}
                      onClick={() =>
                        !synthLoading &&
                        synthContext?.setCurrent((prev) => ({
                          ...prev,
                          layer:
                            prev?.synth?.children[
                              (prev?.synth?.children
                                ?.map((child) => child?.id)
                                ?.indexOf(prev?.layer?.id!)! -
                                1 +
                                prev?.synth?.children?.length!) %
                                prev?.synth?.children?.length!
                            ],
                        }))
                      }
                    />
                  </div>
                  <div
                    className={`relative w-5 h-5 flex items-center justify-center  ${
                      !synthLoading && "cursor-pointer active:scale-95"
                    }`}
                  >
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/QmcBVNVZWGBDcAxF4i564uSNGZrUvzhu5DKkXESvhY45m6`}
                      layout="fill"
                      draggable={false}
                      onClick={() =>
                        !synthLoading &&
                        synthContext?.setCurrent((prev) => ({
                          ...prev,
                          layer:
                            prev?.synth?.children[
                              (prev?.synth?.children
                                ?.map((child) => child?.id)
                                ?.indexOf(prev?.layer?.id!)! +
                                1) %
                                prev?.synth?.children?.length!
                            ],
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative preG:absolute preG:bottom-6 preG:right-2 lg:right-9 w-full preG:w-fit h-fit flex flex-row gap-3 text-white items-center justify-center text-center preG:pt-0 pt-4 preG:order-2 order-3">
          <div className="relative w-9 h-3 items-center justify-center hidden preG:flex synth:hidden 2xl:flex flex-row">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmZ4XuwsWcHpCXq56LNmAuvVck7D7WLmXWLcLJmGm1rjC4`}
              layout="fill"
              draggable={false}
            />
          </div>
          <div
            className={`relative w-fit h-fit items-center justify-center text-center flex font-mega  uppercase flex-col md:flex-row gap-1 ${
              path?.includes("/en/")
                ? "text-sm lg:text-xl xl:text-sm synth:text-xl"
                : "text-sm lg:text-base xl:text-sm synth:text-base"
            }`}
          >
            <div
              className="relative w-fit h-fit px-1.5 py-1 border border-eme rounded-md cursor-pointer flex items-center justify-center active:scale-95"
              onClick={() => scrollToComposite()}
            >
              {dict?.Common?.con}
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center">
              {dict?.Common?.or}
            </div>
            <div
              className="relative w-fit h-fit px-1.5 py-1 border border-smol rounded-md cursor-pointer flex items-center justify-center active:scale-95"
              onClick={() => context?.setModalOpen(dict?.Common?.clear)}
            >
              {dict?.Common?.again}
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center">
              ?
            </div>
          </div>
        </div>
        <div
          className={`relative justify-center flex preG:absolute text-white  text-sm sm:text-xl synth:text-3xl uppercase preG:bottom-4 preG:pt-0 pt-3 preG:order-3 order-2 ${
            path?.includes("/es/") ? "font-bit" : "font-mana"
          }`}
          draggable={false}
        >
          {dict?.Common?.preset}
        </div>
      </div>
    </div>
  );
};

export default Synth;

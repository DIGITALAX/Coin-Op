import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { GridProps } from "../types/synth.types";
import { setLayerToSynth } from "../../../../../redux/reducers/layerToSynthSlice";
import Dash from "./Dash";
import Presets from "./Presets";
import { setModalOpen } from "../../../../../redux/reducers/modalOpenSlice";
import Canvas from "./Canvas";
import CompleteImages from "./CompleteImages";

const Grid: FunctionComponent<GridProps> = ({
  dispatch,
  synthLayerSelected,
  synthLayer,
  synthConfig,
  handleSynth,
  presets,
  scrollToComposite,
  canvasRef,
  handleMouseDown,
  handleMouseUp,
  newLayersLoading,
  handleMouseMove,
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
  handleReset,
  action,
  handleBlur,
  writingRef,
  selectedElement,
  font,
  fontOpen,
  setFont,
  setFontOpen,
  canvasExpand,
  materialBackground,
  materialOpen,
  setMaterialBackground,
  setMaterialOpen,
  completedSynths,
  handleDownloadImage,
  synthLoading,
  itemClicked,
  setItemClicked,
  controlType,
  setControlType,
}): JSX.Element => {
  return (
    <div className="relative w-full h-100 flex flex-col gap-2">
      <div className="absolute w-full h-full flex">
        <Image
          alt="copy"
          layout="fill"
          src={`${INFURA_GATEWAY}/ipfs/QmZibAC5QRhVVNnXUQZaBcWtmYxUoFjCcGMTZcccJK7RXe`}
          draggable={false}
        />
      </div>
      <div className={`relative w-full flex h-5/6 px-7 pt-4`}>
        <div
          className={`w-full flex h-full gap-8 items-center justify-center transition-all duration-300 ease-in-out ${
            canvasExpand
              ? "flex-col z-30 bg-opacity-90 backdrop-blur-sm bg-black inset-0 fixed p-2"
              : "flex-row relative"
          }`}
        >
          <div
            className={`relative flex gap-3 w-full ${
              canvasExpand ? "flex-row h-52" : "flex-col h-full"
            }`}
          >
            <div className="relative w-full h-full flex items-center justify-center rounded-md border border-ama">
              <Dash
                synthConfig={synthConfig}
                dispatch={dispatch}
                handleSynth={handleSynth}
                synthLoading={synthLoading}
                controlType={controlType}
                setControlType={setControlType}
                canvasExpand={canvasExpand}
              />
            </div>
            <div className="relative w-100 h-52 flex items-center justify-center rounded-md border border-ama">
              <Presets
                presets={presets}
                dispatch={dispatch}
                synthConfig={synthConfig}
              />
            </div>
          </div>
          <div className={`relative w-full h-full flex flex-col gap-3`}>
            {(completedSynths.get(String(synthLayerSelected.id))?.synths || [])
              ?.length > 0 && (
              <CompleteImages
                canvasExpand={canvasExpand}
                completeImages={completedSynths}
                dispatch={dispatch}
                synthLayerSelected={synthLayerSelected}
                handleDownloadImage={handleDownloadImage}
                synthLoading={synthLoading}
                itemClicked={itemClicked}
                setItemClicked={setItemClicked}
              />
            )}
            <Canvas
              materialBackground={materialBackground}
              setMaterialBackground={setMaterialBackground}
              materialOpen={materialOpen}
              setMaterialOpen={setMaterialOpen}
              dispatch={dispatch}
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
              canvasExpand={canvasExpand}
              layerToSynth={synthLayerSelected}
            />
            <div
              className={`w-full flex justify-center items-center flex-row gap-3 ${
                canvasExpand
                  ? `absolute p-2 h-14 ${
                      (
                        completedSynths.get(String(synthLayerSelected.id))
                          ?.synths || []
                      )?.length > 0
                        ? "top-10"
                        : "top-2"
                    }`
                  : "relative h-10"
              }`}
            >
              <div className="relative w-full h-full flex items-center justify-start">
                <div className="relative w-fit h-full items-center justify-start flex flex-row gap-3">
                  {(synthLayer?.childTokenURIs &&
                  synthLayer?.childTokenURIs?.length < 4
                    ? synthLayer?.childTokenURIs
                    : Array(3)
                        .fill(null)
                        .map(
                          (_, index) =>
                            synthLayer?.childTokenURIs[
                              (synthLayer?.childTokenURIs.indexOf(
                                synthLayerSelected.layer!
                              ) +
                                index) %
                                synthLayer?.childTokenURIs.length
                            ]
                        )
                  )?.map((uri: string | undefined, index: number) => {
                    return (
                      <div
                        className={`relative w-20 h-full flex flex-row items-center justify-center gap-2 border hover:opacity-70 rounded-lg ${
                          synthLayerSelected.layer === uri
                            ? "border-white"
                            : "border-ama"
                        } ${!synthLoading && "cursor-pointer"}`}
                        key={index}
                        onClick={() =>
                          !synthLoading &&
                          dispatch(
                            setLayerToSynth({
                              id: synthLayer?.childId! + index,
                              layer: uri!,
                            })
                          )
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
                          {uri?.split("ipfs://")[1] && (
                            <Image
                              src={`${INFURA_GATEWAY}/ipfs/${
                                uri?.split("ipfs://")[1]
                              }`}
                              layout="fill"
                              objectFit="contain"
                              draggable={false}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                className={`relative w-fit h-full flex flex-row items-center justify-center gap-1.5 ${
                  canvasExpand && "right-6"
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
                      dispatch(
                        setLayerToSynth({
                          id:
                            synthLayer?.childId! +
                            ((synthLayer?.childTokenURIs?.indexOf(
                              synthLayerSelected.layer!
                            )! -
                              1 +
                              synthLayer?.childTokenURIs?.length!) %
                              synthLayer?.childTokenURIs?.length!),
                          layer:
                            synthLayer?.childTokenURIs?.[
                              (synthLayer?.childTokenURIs?.indexOf(
                                synthLayerSelected.layer!
                              ) -
                                1 +
                                synthLayer?.childTokenURIs?.length) %
                                synthLayer?.childTokenURIs?.length
                            ]!,
                        })
                      )
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
                      dispatch(
                        setLayerToSynth({
                          id:
                            synthLayer?.childId! +
                            ((synthLayer?.childTokenURIs?.indexOf(
                              synthLayerSelected.layer!
                            )! +
                              1) %
                              synthLayer?.childTokenURIs?.length!),
                          layer:
                            synthLayer?.childTokenURIs?.[
                              (synthLayer?.childTokenURIs?.indexOf(
                                synthLayerSelected.layer!
                              ) +
                                1) %
                                synthLayer?.childTokenURIs?.length
                            ]!,
                        })
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 right-9 w-fit h-fit flex flex-row gap-3 text-white items-center justify-center text-center">
        <div className="relative w-9 h-3 items-center justify-center flex flex-row">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmZ4XuwsWcHpCXq56LNmAuvVck7D7WLmXWLcLJmGm1rjC4`}
            layout="fill"
            draggable={false}
          />
        </div>
        <div className="relative w-fit h-fit items-center justify-center text-center flex font-mega text-xl uppercase flex-row gap-1">
          <div
            className="relative w-fit h-fit px-1.5 py-1 border border-eme rounded-md cursor-pointer flex items-center justify-center active:scale-95"
            onClick={() => scrollToComposite()}
          >
            continue
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center">
            or
          </div>
          <div
            className="relative w-fit h-fit px-1.5 py-1 border border-smol rounded-md cursor-pointer flex items-center justify-center active:scale-95"
            onClick={() =>
              dispatch(
                setModalOpen({
                  actionOpen: true,
                  actionMessage:
                    "Are you sure you want to clear all synths for this composite and restart?",
                })
              )
            }
          >
            start again
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center">
            ?
          </div>
        </div>
      </div>
      <div
        className="absolute text-white font-mana text-3xl uppercase bottom-4"
        draggable={false}
      >
        presets & synth
      </div>
    </div>
  );
};

export default Grid;

import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import Image from "next/legacy/image";
import { ImCross } from "react-icons/im";
import { MdDownloadForOffline } from "react-icons/md";
import { CompleteImagesProps } from "../types/synth.types";
import { setCompletedSynths } from "../../../../../redux/reducers/completedSynthsSlice";

const CompleteImages: FunctionComponent<CompleteImagesProps> = ({
  canvasExpand,
  completeImages,
  dispatch,
  synthLayerSelected,
  handleDownloadImage,
  synthLoading,
}): JSX.Element => {
  return (
    <div
      className={`w-full flex justify-center items-center flex-row gap-3 ${
        canvasExpand ? "relative h-14" : "relative h-10"
      }`}
    >
      <div className="relative w-full h-full flex items-center justify-start">
        <div className="relative w-fit h-full items-center justify-start flex flex-row gap-3">
          {((completeImages.get(String(synthLayerSelected.id))?.synths || [])
            .length < 4
            ? completeImages.get(String(synthLayerSelected.id))?.synths || []
            : Array(3)
                .fill(null)
                .map(
                  (_, index) =>
                    (completeImages.get(String(synthLayerSelected.id))
                      ?.synths || [])[
                      ((
                        completeImages.get(String(synthLayerSelected.id))
                          ?.synths || []
                      ).indexOf(
                        completeImages.get(String(synthLayerSelected.id))
                          ?.chosen!
                      ) +
                        index) %
                        (
                          completeImages.get(String(synthLayerSelected.id))
                            ?.synths || []
                        ).length
                    ]
                )
          )?.map((image: string, index: number) => {
            return (
              <div
                className={`relative w-20 h-full flex flex-row items-center justify-center gap-2 border rounded-lg ${
                  completeImages.get(String(synthLayerSelected.id))?.chosen ===
                  image
                    ? "border-white"
                    : "border-ama"
                } ${!synthLoading && "cursor-pointer"}`}
                key={index}
                onClick={() => {
                  if (synthLoading) return;
                  let newCompletedSynths = new Map(completeImages);
                  newCompletedSynths.set(String(synthLayerSelected.id), {
                    synths:
                      completeImages.get(String(synthLayerSelected.id))
                        ?.synths || [],
                    chosen: image,
                  });
                  dispatch(setCompletedSynths(newCompletedSynths));
                }}
              >
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmPKU1ck9PLyFchFpe2vzJh3eyxSYij28ixTdRzaHi4E1p`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg absolute"
                  draggable={false}
                />
                <div className="relative w-full h-full flex items-center justify-center hover:opacity-70">
                  {image && (
                    <Image
                      src={`data:image/jpeg;base64, ${image}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                      draggable={false}
                      id="base64Img"
                    />
                  )}
                </div>
                <div
                  className="absolute -top-2 -left-1 w-4 h-4 rounded-full bg-black flex items-center justify-center cursor-pointer bg-white z-1 hover:opacity-70"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadImage();
                  }}
                >
                  <MdDownloadForOffline size={8} color="black" />
                </div>
                <div
                  className="absolute -top-2 -right-1 w-4 h-4 bg-white flex items-center justify-center cursor-pointer rounded-full z-1 hover:opacity-70"
                  onClick={(e) => {
                    e.stopPropagation();
                    let newCompletedSynths = new Map(completeImages);
                    const newArray = (
                      completeImages.get(String(synthLayerSelected.id))
                        ?.synths || []
                    ).filter((item) => image !== item);
                    newCompletedSynths.set(String(synthLayerSelected.id), {
                      synths: newArray,
                      chosen: newArray?.length > 0 ? newArray[0] : "",
                    });
                    dispatch(setCompletedSynths(newCompletedSynths));
                  }}
                >
                  <ImCross size={8} color="black" />
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
            onClick={() => {
              if (synthLoading) return;
              let newCompletedSynths = new Map(completeImages);
              newCompletedSynths.set(String(synthLayerSelected.id), {
                synths:
                  completeImages.get(String(synthLayerSelected.id))?.synths ||
                  [],
                chosen: (completeImages.get(String(synthLayerSelected.id))
                  ?.synths || [])?.[
                  ((
                    completeImages.get(String(synthLayerSelected.id))?.synths ||
                    []
                  )?.indexOf(
                    completeImages.get(String(synthLayerSelected.id))?.chosen!
                  ) -
                    1 +
                    (
                      completeImages.get(String(synthLayerSelected.id))
                        ?.synths || []
                    )?.length) %
                    (
                      completeImages.get(String(synthLayerSelected.id))
                        ?.synths || []
                    )?.length
                ]!,
              });
              dispatch(setCompletedSynths(newCompletedSynths));
            }}
          />
        </div>
        <div
          className={`relative w-5 h-5 flex items-center justify-center ${
            !synthLoading && "cursor-pointer active:scale-95"
          }`}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmcBVNVZWGBDcAxF4i564uSNGZrUvzhu5DKkXESvhY45m6`}
            layout="fill"
            draggable={false}
            onClick={() => {
              if (synthLoading) return;
              let newCompletedSynths = new Map(completeImages);
              newCompletedSynths.set(String(synthLayerSelected.id), {
                synths:
                  completeImages.get(String(synthLayerSelected.id))?.synths ||
                  [],
                chosen: (completeImages.get(String(synthLayerSelected.id))
                  ?.synths || [])?.[
                  ((
                    completeImages.get(String(synthLayerSelected.id))?.synths ||
                    []
                  )?.indexOf(
                    completeImages.get(String(synthLayerSelected.id))?.chosen!
                  ) +
                    1) %
                    (
                      completeImages.get(String(synthLayerSelected.id))
                        ?.synths || []
                    )?.length
                ]!,
              });
              dispatch(setCompletedSynths(newCompletedSynths));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CompleteImages;

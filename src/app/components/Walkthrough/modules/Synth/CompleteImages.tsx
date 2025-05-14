import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { ImCross } from "react-icons/im";
import { MdDownloadForOffline } from "react-icons/md";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { SynthContext } from "@/app/providers";
import { CompleteImagesProps } from "../../types/walkthrough.types";

const CompleteImages: FunctionComponent<CompleteImagesProps> = ({
  handleDownloadImage,
  synthLoading,
  itemClicked,
  setItemClicked,
}): JSX.Element => {
  const synthContext = useContext(SynthContext);
  return (
    <div
      className={`w-full flex justify-center items-center flex-row gap-3 h-10 ${
        synthContext?.canvasExpand ? "absolute z-1 p-2" : "relative"
      }`}
    >
      <div className="relative w-full h-full flex items-center justify-start">
        <div className="relative w-fit h-full items-center justify-start flex flex-row gap-3">
          {((
            synthContext?.current?.completedSynths?.get(
              String(synthContext?.current?.layer?.id)
            )?.synths || []
          ).length < 4
            ? synthContext?.current?.completedSynths?.get(
                String(synthContext?.current?.layer?.id)
              )?.synths || []
            : Array(3)
                .fill(null)
                .map(
                  (_, index) =>
                    (synthContext?.current?.completedSynths?.get(
                      String(synthContext?.current?.layer?.id)
                    )?.synths || [])[
                      ((
                        synthContext?.current?.completedSynths?.get(
                          String(synthContext?.current?.layer?.id)
                        )?.synths || []
                      ).indexOf(
                        synthContext?.current?.completedSynths?.get(
                          String(synthContext?.current?.layer?.id)
                        )?.chosen!
                      ) +
                        index) %
                        (
                          synthContext?.current?.completedSynths?.get(
                            String(synthContext?.current?.layer?.id)
                          )?.synths || []
                        ).length
                    ]
                )
          )?.map((image: string, index: number) => {
            return (
              <div
                className={`relative w-20 h-full flex flex-row items-center justify-center gap-2 border rounded-lg ${
                  synthContext?.current?.completedSynths?.get(
                    String(synthContext?.current?.layer?.id)
                  )?.chosen === image
                    ? "border-white"
                    : "border-ama"
                } ${!synthLoading && "cursor-pointer"}`}
                key={index}
                onClick={() => {
                  if (synthLoading) return;
                  let newCompletedSynths = new Map(
                    synthContext?.current?.completedSynths
                  );
                  newCompletedSynths.set(
                    String(synthContext?.current?.layer?.id),
                    {
                      synths:
                        synthContext?.current?.completedSynths?.get(
                          String(synthContext?.current?.layer?.id)
                        )?.synths || [],
                      chosen: image,
                    }
                  );
                  setItemClicked(!itemClicked);
                  synthContext?.setCurrent((prev) => ({
                    ...prev,
                    completedSynths: newCompletedSynths,
                  }));
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
                    handleDownloadImage(`data:image/jpeg;base64,${image}`);
                  }}
                >
                  <MdDownloadForOffline size={8} color="black" />
                </div>
                <div
                  className="absolute -top-2 -right-1 w-4 h-4 bg-white flex items-center justify-center cursor-pointer rounded-full z-1 hover:opacity-70"
                  onClick={(e) => {
                    e.stopPropagation();
                    let newCompletedSynths = new Map(
                      synthContext?.current?.completedSynths
                    );
                    const newArray = (
                      synthContext?.current?.completedSynths?.get(
                        String(synthContext?.current?.layer?.id)
                      )?.synths || []
                    ).filter((item) => image !== item);
                    newCompletedSynths.set(
                      String(synthContext?.current?.layer?.id),
                      {
                        synths: newArray,
                        chosen: newArray?.length > 0 ? newArray[0] : "",
                      }
                    );
                    synthContext?.setCurrent((prev) => ({
                      ...prev,
                      completedSynths: newCompletedSynths,
                    }));
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
            onClick={() => {
              if (synthLoading) return;
              let newCompletedSynths = new Map(
                synthContext?.current?.completedSynths
              );
              newCompletedSynths.set(String(synthContext?.current?.layer?.id), {
                synths:
                  synthContext?.current?.completedSynths?.get(
                    String(synthContext?.current?.layer?.id)
                  )?.synths || [],
                chosen: (synthContext?.current?.completedSynths?.get(
                  String(synthContext?.current?.layer?.id)
                )?.synths || [])?.[
                  ((
                    synthContext?.current?.completedSynths?.get(
                      String(synthContext?.current?.layer?.id)
                    )?.synths || []
                  )?.indexOf(
                    synthContext?.current?.completedSynths?.get(
                      String(synthContext?.current?.layer?.id)
                    )?.chosen!
                  ) -
                    1 +
                    (
                      synthContext?.current?.completedSynths?.get(
                        String(synthContext?.current?.layer?.id)
                      )?.synths || []
                    )?.length) %
                    (
                      synthContext?.current?.completedSynths?.get(
                        String(synthContext?.current?.layer?.id)
                      )?.synths || []
                    )?.length
                ]!,
              });
              synthContext?.setCurrent((prev) => ({
                ...prev,
                completedSynths: newCompletedSynths,
              }));
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
              let newCompletedSynths = new Map(
                synthContext?.current?.completedSynths
              );
              newCompletedSynths.set(String(synthContext?.current?.layer?.id), {
                synths:
                  synthContext?.current?.completedSynths?.get(
                    String(synthContext?.current?.layer?.id)
                  )?.synths || [],
                chosen: (synthContext?.current?.completedSynths?.get(
                  String(synthContext?.current?.layer?.id)
                )?.synths || [])?.[
                  ((
                    synthContext?.current?.completedSynths?.get(
                      String(synthContext?.current?.layer?.id)
                    )?.synths || []
                  )?.indexOf(
                    synthContext?.current?.completedSynths?.get(
                      String(synthContext?.current?.layer?.id)
                    )?.chosen!
                  ) +
                    1) %
                    (
                      synthContext?.current?.completedSynths?.get(
                        String(synthContext?.current?.layer?.id)
                      )?.synths || []
                    )?.length
                ]!,
              });
              synthContext?.setCurrent((prev) => ({
                ...prev,
                completedSynths: newCompletedSynths,
              }));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CompleteImages;

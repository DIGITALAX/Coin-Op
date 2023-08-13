import { FunctionComponent } from "react";
import { SetProps } from "../types/layer.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { setSynthLayer } from "../../../../../redux/reducers/synthLayerSlice";
import { setLayerToSynth } from "../../../../../redux/reducers/layerToSynthSlice";

const Set: FunctionComponent<SetProps> = ({
  dispatch,
  synthLayer,
  childId,
  childPrice,
  childTokenURIs,
  parentId,
  parentPrice,
  parentURI,
  childPosterURI,
}): JSX.Element => {
  return (
    <div
      className={`relative w-48 h-44 flex flex-col items-center justify-center cursor-pointer overflow-hidden hover:opacity-70 ${
        childId === synthLayer?.childId && "opacity-40"
      }`}
      onClick={() => {
        dispatch(
          setSynthLayer({
            parentURI,
            childTokenURIs,
            parentPrice,
            childPrice,
            parentId,
            childId,
            childPosterURI,
          })
        );
        dispatch(
          setLayerToSynth({
            id: childId + 0,
            layer: childTokenURIs?.[0]!,
          })
        );
      }}
    >
      <div className="absolute w-full h-full">
        <Image
          layout="fill"
          objectFit="cover"
          src={`${INFURA_GATEWAY}/ipfs/QmabrLTvs7EW8P9sZ2WGcf1gSrc4n3YmsFyvtcLYN8gtuP`}
          draggable={false}
        />
      </div>
      <div className="relative flex flex-col w-full h-full gap-2 items-center justify-between p-2">
        <div className="relative w-full h-3/4">
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              layout="fill"
              objectFit="contain"
              src={`${INFURA_GATEWAY}/ipfs/${parentURI?.split("ipfs://")[1]}`}
              draggable={false}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center h-full w-full">
            <div className="relative items-center justify-center flex w-full h-full">
              <Image
                layout="fill"
                objectFit="contain"
                src={`${INFURA_GATEWAY}/ipfs/${
                  childPosterURI?.split("ipfs://")[1]
                }`}
                draggable={false}
                className="flex items-center"
              />
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-row font-mana text-white text-xxs px-1.5 gap-1.5 justify-between">
          <div className="relative w-fit h-fit">FGO</div>
          <div className="relative w-fit h-fit">PID-{parentId}</div>
          <div className="relative w-fit h-fit">
            ${Number(parentPrice) / 10 ** 18}
          </div>
          <div className="relative w-fit h-fit">CID-{childId}</div>
          <div className="relative w-fit h-fit">
            ${Number(childPrice) / 10 ** 18}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Set;

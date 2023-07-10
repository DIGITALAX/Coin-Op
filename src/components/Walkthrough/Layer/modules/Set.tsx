import { FunctionComponent } from "react";
import { SetProps } from "../types/layer.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { setSynthLayer } from "../../../../../redux/reducers/synthLayerSlice";

const Set: FunctionComponent<SetProps> = ({ layer, dispatch, synthLayer }): JSX.Element => {
  return (
    <div
      className={`relative w-48 h-44 flex flex-col items-center justify-center cursor-pointer hover:opacity-70 ${layer.parentURI === synthLayer.parentURI && "opacity-60"}`}
      onClick={() => {
        dispatch(setSynthLayer(layer));
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
    </div>
  );
};

export default Set;

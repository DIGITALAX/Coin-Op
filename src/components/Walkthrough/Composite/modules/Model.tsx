import { FunctionComponent } from "react";
import { ModelProps } from "../types/composite.types";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import Image from "next/legacy/image";

const Model: FunctionComponent<ModelProps> = ({ model }): JSX.Element => {
  return (
    <div className="relative w-60 h-full rounded-md border border-ama bg-cross opacity-20 mix-blend-hard-light">
      <Image
        layout="fill"
        objectFit="cover"
        src={`${INFURA_GATEWAY}/ipfs/${model}`}
        className="rounded-md"
        draggable={false}
      />
    </div>
  );
};

export default Model;

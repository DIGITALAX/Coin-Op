import { FunctionComponent, JSX } from "react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ModelProps } from "../../types/walkthrough.types";

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

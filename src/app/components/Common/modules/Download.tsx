import { FunctionComponent, JSX } from "react";
import { useDraggable } from "@dnd-kit/core";
import { DownloadProps } from "../types/common.types";
import Image from "next/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { FaLinux, FaWindows, FaApple } from "react-icons/fa";

const Download: FunctionComponent<DownloadProps> = ({
  dict,
  position,
}): JSX.Element => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "download",
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
      }}
      {...listeners}
      {...attributes}
      className="absolute w-60 h-52 flex items-start justify-start font-chic flex-col border-2 border-white bg-black cursor-grab text-agua"
    >
      <div className="relative w-full h-fit flex flex-row justify-between  gap-2">
        <div className="relative w-full h-full flex">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmbwW3TA11oHzaLVHkx2YDRX13Y1LeF4dD3UF5zVYQvetd`}
            layout="fill"
            objectFit="fill"
            alt="pattern"
            draggable={false}
          />
        </div>
        <div className="relative text-white w-fit h-fit font-count flex">
          {dict?.Common?.begin}
        </div>
        <div className="relative w-full h-full flex">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmbwW3TA11oHzaLVHkx2YDRX13Y1LeF4dD3UF5zVYQvetd`}
            layout="fill"
            objectFit="fill"
            alt="pattern"
            draggable={false}
          />
        </div>
      </div>
      <div className="relative w-full h-1 bg-white"></div>
      <div className="relative w-full h-full p-2 text-center uppercase flex items-center justify-center flex-col gap-2">
        <div className="relative w-fit h-fit flex text-sm">
          {dict?.Common?.eth}
        </div>
        <div className="relative w-fit font-bit h-fit flex text-white text-lg">
          {dict?.Common?.download}
        </div>

        <div className="relative w-full flex flex-row gap-6 justify-between items-center">
          <a
            href="https://github.com/DIGITALAX/Coin-Op-App/releases/download/v0.1.0/coinop_0.1.0_universal.dmg"
            
            className="cursor-pointer"
          >
            <FaApple color="white" size={20} />
          </a>
          <a
            href="https://github.com/DIGITALAX/Coin-Op-App/releases/download/v0.1.0/coinop_0.1.0_x64-setup.exe"
            className="cursor-pointer"
          >
            <FaWindows color="white" size={20} />
          </a>
          <a
            href="https://github.com/DIGITALAX/Coin-Op-App/releases/download/v0.1.0/coinop_0.1.0_amd64.AppImage"
            className="cursor-pointer"
          >
            <FaLinux color="white" size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Download;

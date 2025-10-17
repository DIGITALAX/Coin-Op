import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ScrollContext } from "@/app/providers";
import Image from "next/image";
import { FunctionComponent, JSX, useContext, useEffect, useRef, useState } from "react";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import Download from "./Download";

const Hook: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const scrollContext = useContext(ScrollContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        setPosition({
          x: containerWidth * 0.6,
          y: containerHeight * 0.5
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } })
  );

  return (
    <div className="relative w-full h-fit flex flex-col gap-6 p-4 items-center justify-start">
      <div className="absolute top-0 left-0 flex w-full h-full">
        <Image
          layout="fill"
          objectFit="cover"
          src={`${INFURA_GATEWAY}/ipfs/QmRfHNroh4MKVMEUV7t9MKk83eyaS3ZthctVV82uZ74tNu`}
          draggable={false}
          alt="cover"
        />
      </div>
      <div
        className="relative font-monu text-white text-3xl preG:text-5xl flex flex-col items-center justify-center w-full sm:w-3/4 h-fit break-words text-center pt-2 sm:pt-0"
        ref={scrollContext?.prerollRef}
        draggable={false}
      >
        {dict?.Common?.hook}
      </div>
      <div className="relative w-full md:w-3/4 flex bg-black rounded-md border-4 p-4 border-agua h-fit flex-col gap-6 font-awk text-white text-2xl uppercase">
        <div className="relative w-full h-fit items-center flex-row justify-between justify-center flex">
          <div className="relative w-fit h-fit break-words items-center justify-center">
            {dict?.Common?.know} {dict?.Common?.mac} {dict?.Common?.start}
          </div>
        </div>
        <div className="relative flex w-full h-72 md:h-96" ref={containerRef}>
          <Image
            layout="fill"
            objectFit="contain"
            src={`${INFURA_GATEWAY}/ipfs/QmWQSPsMNzJ1A2BsRCzAYx5pdSxkcvrUFNFxniGP6xzoWn`}
            draggable={false}
            alt="Download"
          />
        </div>
        <DndContext
          onDragEnd={(event) => {
            if (event.delta) {
              setPosition((prev) => ({
                x: prev.x + event.delta.x,
                y: prev.y + event.delta.y,
              }));
            }
          }}
          modifiers={[restrictToParentElement, restrictToWindowEdges]}
          sensors={sensors}
        >
          <Download dict={dict} position={position} />
        </DndContext>
      </div>
    </div>
  );
};

export default Hook;

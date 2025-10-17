"use client";

import { useContext } from "react";
import usePrerolls from "../hooks/usePrerolls";
import { ModalContext } from "@/app/providers";
import Preroll from "./Preroll";

export default function Prerolls({ dict }: { dict: any }) {
  const contexto = useContext(ModalContext);
  const { imagesLoading, setImagesLoading } = usePrerolls();
  return (
    <div className="relative w-full xl:w-fit xl:h-[165rem] xl:overflow-y-auto flex xl:overflow-x-hidden overflow-x-scroll">
      <div className="relative w-full xl:w-48 h-fit flex xl:flex-col flex-row justify-start items-center gap-10">
        {contexto?.prerollsLoading || Number(contexto?.prerolls?.length) < 1
          ? Array.from({ length: 40 }).map((_, index: number) => {
              return (
                <div
                  className="relative w-fit flex h-fit gap-2 p-3"
                  key={index}
                >
                  <div className="relative w-48 h-80 flex rounded-sm border border-white">
                    <div
                      className="relative w-full h-full flex"
                      id={"staticLoad"}
                    ></div>
                  </div>
                </div>
              );
            })
          : contexto?.prerolls?.map((preroll, index: number) => {
              return (
                <Preroll
                  key={index}
                  dict={dict}
                  preroll={preroll}
                  setImagesLoading={setImagesLoading}
                  imageLoading={imagesLoading[index]}
                  index={index}
                />
              );
            })}
      </div>
    </div>
  );
}

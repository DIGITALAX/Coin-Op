"use client";

import { useContext } from "react";
import usePrerolls from "../hooks/usePrerolls";
import { ModalContext } from "@/app/providers";
import Preroll from "./Preroll";

export default function PrerollsEntry({
  dict,
  left,
  right,
}: {
  dict: any;
  left?: boolean;
  right?: boolean;
}) {
  const contexto = useContext(ModalContext);
  const {
    imagesLoadingLeft,
    imagesLoadingRight,
    setImagesLoadingLeft,
    setImagesLoadingRight,
  } = usePrerolls();
  return (
    <div className="relative w-full xl:w-fit h-fit xl:h-full flex xl:overflow-y-scroll overflow-x-scroll xl:overflow-x-hidden">
      <div className="relative w-full xl:w-48 h-fit flex xl:flex-col flex-row justify-start items-center gap-10">
        {contexto?.prerollsLoading ||
        Number(contexto?.prerolls.left?.length) < 1
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
          : (left ? contexto?.prerolls.left : contexto?.prerolls.right)?.map(
              (preroll, index: number) => {
                return (
                  <Preroll
                    key={index}
                    dict={dict}
                    preroll={preroll}
                    left={left}
                    right={right}
                    setImagesLoading={
                      left ? setImagesLoadingLeft : setImagesLoadingRight
                    }
                    imageLoading={
                      left
                        ? imagesLoadingLeft[index]
                        : imagesLoadingRight[index]
                    }
                    index={index}
                  />
                );
              }
            )}
      </div>
    </div>
  );
}

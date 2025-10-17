"use client";

import Hook from "./Hook";
import MobileFotos from "./MobileFotos";
import Sticky from "./Sticky";

export default function HeaderEntry({ dict }: { dict: any }) {
  return (
    <div className="relative w-full h-fit items-center justify-center flex flex-col pb-20">
      <MobileFotos dict={dict} />
      <Sticky dict={dict} />
      <Hook dict={dict} />
    </div>
  );
}

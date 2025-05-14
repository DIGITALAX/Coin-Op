"use client";

import Hook from "./Hook";
import MobileFotos from "./MobileFotos";
import RollSearch from "./RollSearch";
import Sticky from "./Sticky";

export default function HeaderEntry({ dict }: { dict: any }) {
  return (
    <div className="relative w-full h-fit items-center justify-center flex flex-col gap-20 px-3 pt-2 pb-20">
      <MobileFotos dict={dict} />
      <Sticky dict={dict} />
      <RollSearch dict={dict} />
      <Hook dict={dict} />
    </div>
  );
}

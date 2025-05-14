"use client";

import Composite from "../../Walkthrough/modules/Composite/Composite";
import Format from "../../Walkthrough/modules/Format/Format";
import Layer from "../../Walkthrough/modules/Layer/Layer";
import Purchase from "../../Walkthrough/modules/Purchase/Purchase";
import Synth from "../../Walkthrough/modules/Synth/Synth";
import TopBanner from "./TopBanner";

export default function Entry({ dict }: { dict: any }) {
  return (
    <div className="relative w-full xl:w-[calc(100vw-35rem)] h-full flex flex-col gap-5">
      <TopBanner dict={dict} />
      <div className="relative w-full h-full flex flex-col overflow-y-scroll gap-20 justify-start items-center overflow-x-hidden">
        <Format dict={dict} />
        <Layer dict={dict} />
        <Synth dict={dict} />
        <Composite dict={dict} />
        <Purchase dict={dict} />
      </div>
    </div>
  );
}

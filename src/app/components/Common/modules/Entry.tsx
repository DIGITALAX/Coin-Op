"use client";

import { INFURA_GATEWAY } from "@/app/lib/constants";
import Prerolls from "../../Prerolls/modules/Prerolls";
import Purchase from "../../Walkthrough/modules/Purchase/Purchase";
import AppMarket from "./AppMarket";
import Walkthrough from "./Walkthrough";
import Image from "next/image";

export default function Entry({ dict }: { dict: any }) {
  return (
    <div className="relative overflow-hidden w-full flex flex-col xl:grid xl:grid-cols-[auto_1fr] px-2 preG:px-6 md:gap-28 gap-10 items-center xl:items-start justify-start pb-[32rem]">
      <div className="absolute flex w-full h-[60rem] bottom-0 left-0">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmUczkYYGyeMTKdRNmp8AX4AQc8Qvw6hR8nVnXKSfAuFdj`}
          draggable={false}
          layout="fill"
          objectFit="cover"
          alt="retro"
        />
      </div>
      <Prerolls dict={dict} />
      <div className="relative w-full h-full flex flex-col gap-5">
        <AppMarket dict={dict} />
        <Purchase dict={dict} />
        <Walkthrough dict={dict} />
      </div>
    </div>
  );
}

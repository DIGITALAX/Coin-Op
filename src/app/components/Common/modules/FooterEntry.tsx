"use client";

import { INFURA_GATEWAY } from "@/app/lib/constants";
import Image from "next/legacy/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsTwitter, BsGithub } from "react-icons/bs";

export default function FooterEntry({ dict }: { dict: any }) {
  const path = usePathname();

  return (
    <div className="relative w-full h-fit inline-flex flex-wrap items-center justify-start px-4 pb-3 mt-auto pt-8 md:gap-0 gap-5">
      <div className="flex flex-col items-center justify-center preG:items-end preG:justify-end relative preG:absolute preG:right-3 preG:bottom-3 w-full h-fit preG:h-auto preG:w-auto">
        <div
          className="relative flex w-5 h-5 justify-center items-start"
          title="all in the public domain"
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmbdBp58hLPngQ8nmQTtYDfQbUBoT3RowBKu2nrJ67Xne3`}
            layout="fill"
            priority
            draggable={false}
          />
        </div>
      </div>
      <div className="w-full h-full flex flex-row gap-3 justify-center items-center">
        <a
          rel="noreferrer"
          target="_blank"
          href="https://www.digitalax.xyz"
          className="relative w-4 h-4 flex cursor-pointer active:scale-95 justify-center items-center"
          draggable={false}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmSVUP4KFDrQ4pigtY67UbNABeaSFNikAw23ucbGRhh8nU`}
            layout="fill"
            priority
            draggable={false}
          />
        </a>
        <a
          rel="noreferrer"
          target="_blank"
          href="https://cypher.digitalax.xyz/autograph/digitalax"
          className="relative w-5 h-5 flex cursor-pointer active:scale-95 justify-center items-center"
          draggable={false}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/Qmdpju26ySZyrHANGw6Evhnm3phEub9CDZC8gXMhwsj74Z`}
            layout="fill"
            priority
            draggable={false}
          />
        </a>
        <a
          rel="noreferrer"
          target="_blank"
          href="https://github.com/digitalax"
          className="relative w-fit h-fit cursor-pointer active:scale-95 flex justify-center items-center"
          draggable={false}
        >
          <BsGithub size={20} color={"white"} />
        </a>
        <a
          rel="noreferrer"
          target="_blank"
          href="https://twitter.com/DIGITALAX_"
          className="relative w-fit h-fit cursor-pointer active:scale-95 flex justify-center items-center"
          draggable={false}
        >
          <BsTwitter size={20} color={"white"} />
        </a>
      </div>
      <div
        className={`flex flex-col items-start justify-start relative md:absolute text-xs  text-white text-left ${
          path.includes("/es/") ? "font-bit" : "font-mana"
        }`}
      >
        <div className="relative flex w-fit h-fit text-left justify-center items-start">
          {dict?.Footer?.fulf}
        </div>
        <Link
          target="_blank"
          rel="norefferer"
          href="https://www.themanufactory.xyz"
          className="underline cursor-pointer flex text-left justify-center items-start w-fit h-fit"
        >
          {dict?.Footer?.manu}
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useAccount } from "wagmi";
import useParents from "../hooks/useParents";
import { ParentProps, Parent as ParentType } from "../types/account.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import Link from "next/link";
import { AiOutlineLoading } from "react-icons/ai";
import { usePathname } from "next/navigation";

export default function Parent({ dict }: ParentProps) {
  const { isConnected } = useAccount();
  const path = usePathname();
  const {
    parents,
    handleCreateParent,
    handleApproveMarket,
    parentsLoading,
    createParentLoading,
    approveLoading,
  } = useParents(dict);

  if (!isConnected) {
    return null;
  }

  if (parentsLoading) {
    return (
      <div className="relative w-full h-fit flex flex-col gap-4">
        <div className="font-monu text-2xl text-left w-fit h-fit flex justify-start items-center text-white">
          {dict?.Account?.parents}
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="relative h-20 border border-white w-full"
            id="staticLoad"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full h-fit flex flex-col gap-4 text-white">
      <div className="font-monu text-2xl text-left w-fit h-fit flex justify-start items-center">
        {dict?.Account?.parents}
      </div>

      {!parentsLoading && parents?.length < 1 ? (
        <div
          className={`relative w-full h-fit justify-center text-left items-center text-white text-base whitespace-pre-line font-herm ${
            path?.includes("/en/") ? "font-mana" : "font-bit"
          }`}
        >
          {dict?.Account?.noParents}
        </div>
      ) : (
        <>
          {parents?.map((parent: ParentType, index: number) => (
            <div
              key={index}
              className={`relative w-full border border-white bg-smo/10 p-2 h-fit items-start flex flex-col justify-start`}
            >
              <div className="relative w-full h-28 sm:h-16 sm:gap-0 gap-3 inline-flex flex-wrap justify-between items-center text-white font-herm text-sm">
                <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    {dict?.Account?.parentName}
                  </div>
                  <div className="relative w-fit h-fit flex items-center justify-center font-sat">
                    {parent.metadata?.title || parent.title}
                  </div>
                </div>

                <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    {dict?.Account?.parentId}
                  </div>
                  <div className="relative w-fit h-fit flex items-center justify-center font-sat">
                    {parent.designId}
                  </div>
                </div>

                <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    {dict?.Account?.childCount}
                  </div>
                  <div className="relative w-fit h-fit flex items-center justify-center font-sat">
                    {parent.childReferences?.length || 0}
                  </div>
                </div>

                <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    {dict?.Account?.childAuthCount}
                  </div>
                  <div className="relative w-fit h-fit flex items-center justify-center font-sat">
                    {parent.authorizedChildren?.length || 0}
                  </div>
                </div>

                <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    {dict?.Account?.physicalPrice}
                  </div>
                  <div className="relative w-fit h-fit flex items-center justify-center font-sat">
                    {(Number(parent.totalPhysicalPrice)) /
                      10 ** 18}{" "}
                    MONA
                  </div>
                </div>

                <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    {dict?.Account?.maxPhysicalEditions}
                  </div>
                  <div className="relative w-fit h-fit flex items-center justify-center font-sat">
                    {parent.maxPhysicalEditions}
                  </div>
                </div>

                <div className="relative w-fit h-fit items-start justify-center flex flex-col gap-2">
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    {dict?.Account?.parentTxHash}
                  </div>
                  <Link
                    className="relative w-fit h-fit flex items-center justify-center font-sat cursor-pointer break-all"
                    href={`https://explorer.lens.xyz/tx/${parent.transactionHash}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {parent.transactionHash?.slice(0, 6)}...
                    {parent.transactionHash?.slice(-4)}
                  </Link>
                </div>

                <div className="relative flex flex-col gap-2">
                  {parent.canCreate && (
                    <div
                      onClick={() =>
                        handleCreateParent(Number(parent.designId))
                      }
                      className={`relative w-20 h-8 justify-center flex items-center flex-col text-base text-black font-monu border border-black bg-sol ${
                        !createParentLoading &&
                        "cursor-pointer hover:opacity-70"
                      }`}
                    >
                      <div
                        className={`relative flex w-fit h-fit items-center justify-center text-center text-xxs ${
                          createParentLoading && "animate-spin"
                        }`}
                      >
                        {createParentLoading ? (
                          <AiOutlineLoading size={12} color="black" />
                        ) : (
                          dict?.Account?.createParent
                        )}
                      </div>
                    </div>
                  )}

                  {parent.canApprove && (
                    <div
                      onClick={() =>
                        handleApproveMarket(Number(parent.designId))
                      }
                      className={`relative w-20 h-8 justify-center flex items-center flex-col text-base text-black font-monu border border-black bg-sol ${
                        !approveLoading && "cursor-pointer hover:opacity-70"
                      }`}
                    >
                      <div
                        className={`relative flex w-fit h-fit items-center justify-center text-center text-xxs ${
                          approveLoading && "animate-spin"
                        }`}
                      >
                        {approveLoading ? (
                          <AiOutlineLoading size={12} color="black" />
                        ) : (
                          dict?.Account?.approveMarket
                        )}
                      </div>
                    </div>
                  )}

                  <Link
                    href={`https://fgo.themanufactory.xyz/library/parent/${parent.parentContract}/${parent.designId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="relative w-20 h-8 justify-center flex items-center flex-col text-base text-black font-monu border border-black bg-sol cursor-pointer hover:opacity-70"
                  >
                    <div className="relative flex w-fit h-fit items-center justify-center text-center text-xxs">
                      {dict?.Account?.viewOnFgo}
                    </div>
                  </Link>
                </div>
              </div>

              {parent.metadata?.image && (
                <div className="relative w-full h-fit flex justify-start pt-2">
                  <div className="relative w-60 h-60 border border-white">
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${
                        parent.metadata.image.split("ipfs://")[1]
                      }`}
                      alt={parent.metadata?.title || parent.title}
                      layout="fill"
                      objectFit="cover"
                      draggable={false}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

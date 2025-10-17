"use client";

import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import { ImCross } from "react-icons/im";
import { useRouter } from "next/navigation";

const Success: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();

  const handleGoToAccount = () => {
    context?.setModalOpen(undefined);
    router.push("/account");
  };

  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[70vw] tablet:w-[40vw] h-fit max-h-[90vh] place-self-center bg-offBlack rounded-lg border border-white rounded-sm overflow-y-scroll">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-4 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={15}
                  onClick={() => context?.setModalSuccess(undefined)}
                />
              </div>
              <div className="relative w-full h-fit flex flex-col items-center justify-center px-4 gap-6">
                <div className="relative w-fit h-fit flex flex-col items-center justify-center gap-3">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="relative w-fit h-fit justify-center items-center text-white font-bit text-lg text-center">
                    {dict?.Common?.success}
                  </div>
                </div>
                <div className="relative w-3/4 h-fit justify-center items-center text-white font-herm text-sm text-center">
                  {context?.modalSuccess}
                </div>
                <div className="relative w-1/2 h-36 preG:h-52 lg:h-40 xl:h-52 justify-center items-center rounded-lg border border-white bg-cross">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/QmNceKihkEktmp9sTutC9ixf2UV1RsE1sCfsQyDxpPiuSr`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                    draggable={false}
                  />
                </div>
                <div
                  className="relative w-fit h-fit px-6 py-3 bg-black border border-white rounded-sm cursor-pointer font-bit text-white hover:bg-white hover:text-black transition-colors duration-200 active:scale-95 justify-center flex items-center"
                  onClick={handleGoToAccount}
                >
                  {dict?.Common?.goToAccount}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
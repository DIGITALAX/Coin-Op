import { FunctionComponent, JSX, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/legacy/image";

import Link from "next/link";
import { Preroll } from "../../Prerolls/types/prerolls.types";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY, printTypeToString } from "@/app/lib/constants";
import PrintTag from "../../Prerolls/modules/PrintTag";
import { MobileFotosProps } from "../types/common.types";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";

const MobileFotos: FunctionComponent<MobileFotosProps> = ({
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-[95vh] items-center justify-center flex sm:hidden flex-col gap-3 pb-20">
      <Link
        className="relative flex justify-start w-fit h-fit items-center whitespace-nowrap break-words cursor-pointer text-white font-mega"
        href={"/"}
      >
        coin op
      </Link>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="flex w-full h-full relative"
        zoom
        loop
      >
        {context?.prerollsLoading
          ? Array.from({ length: 40 }).map((_, index: number) => {
              return (
                <SwiperSlide
                  key={index}
                  className={`h-fit w-full flex relative items-center justify-center p-3 border border-white`}
                  style={{ display: "flex" }}
                >
                  <div
                    className="relative w-full h-full grow"
                    id={"staticLoad"}
                  ></div>
                </SwiperSlide>
              );
            })
          : [
              ...(context?.prerolls?.left || []),
              ...(context?.prerolls?.right || []),
            ].map((preroll: Preroll, index: number) => {
              return (
                <SwiperSlide
                  key={index}
                  className={`h-fit w-full flex flex-col gap-2 relative items-center justify-center`}
                  onClick={(e) => {
                    e.stopPropagation();
                    context?.setSearchExpand(preroll);
                  }}
                  style={{ display: "flex" }}
                >
                  <div
                    className={`w-full h-full border border-white grow p-3 ${
                      preroll.newDrop &&
                      "bg-[radial-gradient(at_center_bottom,_#00abfe,_#00cdc2,_#86a4b3,_#00CDC2)]"
                    }`}
                  >
                    <div
                      className="relative w-full h-full flex"
                      id="staticLoad"
                    >
                      <Image
                        layout="fill"
                        objectFit="cover"
                        src={`${INFURA_GATEWAY}/ipfs/${
                          preroll?.metadata?.images?.[0]?.split("ipfs://")[1]
                        }`}
                        className="w-full h-full flex grow"
                      />
                      {preroll.newDrop && (
                        <div className="absolute top-2 left-2 bg-ama flex w-fit text-base h-fit px-2 py-1 text-black font-monu">
                          🔥 new drop 🔥
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 flex">
                        <PrintTag
                          backgroundColor={preroll.bgColor}
                          type={printTypeToString[Number(preroll.printType)]}
                          dict={dict}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full h-fit flex flex-row border border-white p-1.5 items-center justify-between gap-3">
                    <div
                      className="relative w-fit h-fit flex flex-row gap-1.5 items-center justify-center cursor-pointer"
                      onClick={() =>
                        window.open(
                          `https://cypher.digitalax.xyz/autograph/${preroll?.profile?.username?.localName}`
                        )
                      }
                    >
                      <div className="relative flex rounded-full w-5 h-5 bg-black border border-ama items-center justify-center">
                        <Image
                          className="rounded-full"
                          src={handleProfilePicture(
                            preroll?.profile?.metadata?.picture
                          )}
                          layout="fill"
                          objectFit="cover"
                          draggable={false}
                        />
                      </div>
                      <div className="text-ama w-fit h-fit flex items-center justify-center font-monu text-xxs">
                        {preroll?.profile?.username?.localName}
                      </div>
                    </div>
                    {preroll?.metadata?.title && (
                      <div className="relative w-fit h-fit flex items-center justify-center">
                        <div
                          className="relative flex rounded-full w-5 h-5 bg-black border border-ama items-center justify-center cursor-pointer"
                          onClick={() =>
                            window.open(
                              `https://cypher.digitalax.xyz/item/chromadin/${preroll?.metadata?.title
                                ?.toLowerCase()
                                ?.replaceAll(" ", "_")
                                ?.replaceAll(" ", "_")
                                ?.replaceAll("_(print)", "")}`
                            )
                          }
                          title="nft art"
                        >
                          <Image
                            className="rounded-full"
                            src={
                              "https://ik.imagekit.io/lens/media-snapshot/71fa64480da4a5be0d7904712715f2ba19bb8aad4fdfecc4616572e8ffef0101.png"
                            }
                            layout="fill"
                            objectFit="cover"
                            draggable={false}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
      </Swiper>
    </div>
  );
};

export default MobileFotos;

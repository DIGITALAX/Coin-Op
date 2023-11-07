import { FunctionComponent } from "react";
import { MobileFotosProps } from "../types/layout.types";
import { Swiper, SwiperSlide } from "swiper/react";
import { PreRoll } from "@/components/Common/types/common.types";
import "swiper/css";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import PrintTag from "@/components/Common/modules/PrintTag";
import { setSearchExpand } from "../../../../redux/reducers/searchExpandSlice";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import Link from "next/link";

const MobileFotos: FunctionComponent<MobileFotosProps> = ({
  preRolls,
  dispatch,
  preRollsLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-[95vh] items-center justify-center flex sm:hidden flex-col gap-3">
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
        {preRollsLoading
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
          : [...preRolls?.left, ...preRolls?.right].map(
              (preRoll: PreRoll, index: number) => {
                const profileImage = createProfilePicture(
                  preRoll.uri.profile?.metadata?.picture
                );
                return (
                  <SwiperSlide
                    key={index}
                    className={`h-fit w-full flex flex-col gap-2 relative items-center justify-center`}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(setSearchExpand(preRoll));
                    }}
                    style={{ display: "flex" }}
                  >
                    <div
                      className={`w-full h-full border border-white grow p-3 ${
                        preRoll.newDrop &&
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
                            preRoll.uri.image?.[0]?.split("ipfs://")[1]
                          }`}
                          className="w-full h-full flex grow"
                        />
                        {preRoll.newDrop && (
                          <div className="absolute top-2 left-2 bg-ama flex w-fit text-base h-fit px-2 py-1 text-black font-monu">
                            🔥 new drop 🔥
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 flex">
                          <PrintTag
                            backgroundColor={preRoll.bgColor}
                            type={preRoll.printType}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="relative w-full h-fit flex flex-row border border-white p-1.5 items-center justify-between gap-3">
                      <div
                        className="relative w-fit h-fit flex flex-row gap-1.5 items-center justify-center cursor-pointer"
                        onClick={() =>
                          window.open(
                            `https://www.chromadin.xyz/autograph/${
                              preRoll?.uri?.profile?.handle?.suggestedFormatted?.localName?.split(
                                "@"
                              )[1]
                            }`
                          )
                        }
                      >
                        <div className="relative flex rounded-full w-5 h-5 bg-black border border-ama items-center justify-center">
                          <Image
                            className="rounded-full"
                            src={profileImage}
                            layout="fill"
                            objectFit="cover"
                            draggable={false}
                          />
                        </div>
                        <div className="text-ama w-fit h-fit flex items-center justify-center font-monu text-xxs">
                          {
                            preRoll?.uri?.profile?.handle?.suggestedFormatted?.localName?.split(
                              "@"
                            )[1]
                          }
                        </div>
                      </div>
                      {preRoll?.uri?.chromadinCollectionName && (
                        <div className="relative w-fit h-fit flex items-center justify-center">
                          <div
                            className="relative flex rounded-full w-5 h-5 bg-black border border-ama items-center justify-center cursor-pointer"
                            onClick={() =>
                              window.open(
                                `https://www.chromadin.xyz/autograph/${
                                  preRoll?.uri?.profile?.handle?.suggestedFormatted?.localName?.split(
                                    "@"
                                  )[1]
                                }/collection/${preRoll?.uri?.chromadinCollectionName
                                  ?.toLowerCase()
                                  ?.replaceAll(" ", "_")}`
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
              }
            )}
      </Swiper>
    </div>
  );
};

export default MobileFotos;

import { FunctionComponent, JSX, useContext } from "react";
import { CartItem, PrerollProps } from "../types/prerolls.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY, printTypeToString } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import PrintTag from "./PrintTag";
import ColorChoice from "./ColorChoice";
import SizingChoice from "./SizingChoice";
import InteractBar from "./InteractBar";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";

const Preroll: FunctionComponent<PrerollProps> = ({
  dict,
  preroll,
  left,
  right,
  setImagesLoading,
  index,
  imageLoading,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full flex flex-col h-fit gap-2">
      <div
        className={`relative w-48 xl:w-full h-fit flex flex-col rounded-sm border border-white p-3 gap-5 ${
          preroll.newDrop &&
          "bg-[radial-gradient(at_center_bottom,_#00abfe,_#00cdc2,_#86a4b3,_#00CDC2)]"
        }`}
        id={context?.prerollAnim ? "anim" : ""}
      >
        <div className="relative flex flex-col gap-2 w-full h-fit">
          <div className="relative w-full h-fit flex items-end justify-end font-monu text-xxs text-white">
            <div className="relative w-fit h-fit ml-0 flex items-center justify-center">{`${Number(
              preroll?.tokenIdsMinted?.length || 0
            )} / ${Number(preroll?.amount)}`}</div>
          </div>
          <div className="relative w-full h-60 xl:h-80 flex flex-col object-cover bg-cross bg-cover bg-center cursor-pointer">
            {preroll?.metadata?.images?.length > 0 &&
              (imageLoading ? (
                <div className="relative w-full h-full items-center justify-center flex flex-col"></div>
              ) : (
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${
                    preroll?.metadata?.images?.[preroll?.currentIndex]?.split(
                      "ipfs://"
                    )[1]
                  }`}
                  decoding="async"
                  layout="fill"
                  objectFit="cover"
                  draggable={false}
                  alt="preroll"
                  priority
                  onClick={() =>
                    context?.setVerImagen(
                      `${INFURA_GATEWAY}/ipfs/${
                        preroll?.metadata?.images?.[
                          preroll?.currentIndex
                        ]?.split("ipfs://")[1]
                      }`
                    )
                  }
                  onLoad={() =>
                    setImagesLoading(((prevStates: boolean[]) => {
                      const newStates = [...prevStates];
                      newStates[index] = false;
                      return newStates;
                    }) as any)
                  }
                />
              ))}
            {preroll?.metadata?.images?.length > 1 && (
              <div
                className={`absolute top-2 right-2 w-fit h-fit flex flex-row gap-1.5`}
              >
                <div
                  className={`relative w-5 h-5 flex items-center justify-center cursor-pointer active:scale-95`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagesLoading(((prevStates: boolean[]) => {
                      const newStates = [...prevStates];
                      newStates[index] = true;
                      return newStates;
                    }) as any);
                    const updated = context?.prerolls.map((obj) =>
                      obj.metadata.images?.[0] ===
                      preroll?.metadata?.images?.[0]
                        ? {
                            ...obj,
                            currentIndex:
                              preroll?.currentIndex > 0
                                ? preroll?.currentIndex - 1
                                : preroll?.metadata?.images?.length - 1,
                          }
                        : obj
                    );

                    context?.setPrerolls(updated || []);
                  }}
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/Qma3jm41B4zYQBxag5sJSmfZ45GNykVb8TX9cE3syLafz2`}
                    layout="fill"
                    draggable={false}
                  />
                </div>
                <div
                  className={`relative w-5 h-5 flex items-center justify-center cursor-pointer active:scale-95`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagesLoading(((prevStates: boolean[]) => {
                      const newStates = [...prevStates];
                      newStates[index] = true;
                      return newStates;
                    }) as any);
                    const updated = context?.prerolls.map((obj) =>
                      obj.metadata.images?.[0] ===
                      preroll?.metadata?.images?.[0]
                        ? {
                            ...obj,
                            currentIndex:
                              preroll.currentIndex <
                              preroll?.metadata?.images?.length - 1
                                ? preroll.currentIndex + 1
                                : 0,
                          }
                        : obj
                    );

                    context?.setPrerolls(updated || []);
                  }}
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/QmcBVNVZWGBDcAxF4i564uSNGZrUvzhu5DKkXESvhY45m6`}
                    layout="fill"
                    draggable={false}
                  />
                </div>
              </div>
            )}

            {preroll.newDrop && (
              <div className="absolute bottom-2 right-2 bg-ama flex w-fit text-xxs h-fit px-2 py-1 text-black font-monu">
                {dict?.Common?.new}
              </div>
            )}
          </div>
        </div>
        <div className="relative flex flex-row gap-2 w-full h-fit justify-between">
          <PrintTag
            dict={dict}
            backgroundColor={preroll.bgColor}
            type={printTypeToString[Number(preroll.printType)]}
          />
          <ColorChoice preroll={preroll} left={left} right={right} />
        </div>
        <SizingChoice preroll={preroll} left={left} right={right} />
        <div className="relative flex flex-row gap-2 w-full h-fit items-center">
          <div className="relative text-xl text-white font-aqua flex justify-start items-start w-fit h-fit">
            ${Number(preroll?.price)}
          </div>
          <div
            className="relative text-xl text-white font-aqua flex justify-end ml-auto w-5 items-center h-4 cursor-pointer active:scale-95"
            id={
              context?.cartAddAnim === preroll?.metadata?.images[0]
                ? "cartAddAnim"
                : ""
            }
            onClick={() => {
              const existing = [...(context?.cartItems || [])].findIndex(
                (item) =>
                  item?.item?.collectionId === preroll.collectionId &&
                  item.chosenSize === preroll.chosenSize &&
                  item.chosenColor === preroll.chosenColor
              );

              let newCartItems: CartItem[] = [...(context?.cartItems || [])];

              if (
                Number(
                  context?.cartItems
                    ?.filter(
                      (item) =>
                        item?.item?.postId ==
                        newCartItems?.[existing]?.item?.postId
                    )
                    ?.reduce(
                      (accumulator, currentItem) =>
                        accumulator + currentItem.chosenAmount,
                      0
                    )
                ) +
                  1 >
                  Number(newCartItems?.[existing]?.item?.amount) ||
                Number(newCartItems?.[existing]?.item?.amount) ==
                  Number(newCartItems?.[existing]?.item?.tokenIdsMinted?.length)
              ) {
                context?.setModalOpen(dict?.Common?.eager);
                return;
              }

              if (existing !== -1) {
                newCartItems = [
                  ...newCartItems.slice(0, existing),
                  {
                    ...newCartItems[existing],
                    chosenAmount: newCartItems[existing].chosenAmount + 1,
                  },
                  ...newCartItems.slice(existing + 1),
                ];
              } else {
                newCartItems.push({
                  item: preroll,
                  chosenColor: preroll?.chosenColor,
                  chosenSize: preroll.chosenSize,
                  chosenAmount: 1,
                  chosenIndex:
                    preroll?.printType !== "0" && preroll?.printType !== "1"
                      ? 0
                      : preroll?.metadata?.sizes?.indexOf(preroll.chosenSize),
                });
              }

              context?.setCartItems(newCartItems);
              context?.setCartAddAnim(preroll?.metadata?.images[0]);
            }}
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmcDmX2FmwjrhVDLpNii6NdZ4KisoPLMjpRUheB6icqZcV`}
              layout="fill"
              objectFit="cover"
              draggable={false}
              alt="preroll"
            />
          </div>
        </div>
      </div>
      <InteractBar dict={dict} preroll={preroll} />
      <div className="relative w-full h-10 flex flex-row border border-white p-1.5 items-center justify-between gap-3">
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
              src={handleProfilePicture(preroll?.profile?.metadata?.picture)}
              layout="fill"
              objectFit="cover"
              draggable={false}
            />
          </div>
          <div className="text-ama w-fit h-fit flex items-center justify-center font-monu text-xxs">
            {preroll?.profile?.username?.localName}
          </div>
        </div>
        {preroll?.metadata?.onChromadin == "yes" && (
          <div className="relative w-fit h-fit flex items-center justify-center">
            <div
              className="relative flex rounded-full w-5 h-5 bg-black border border-ama items-center justify-center cursor-pointer"
              onClick={() =>
                window.open(
                  `https://cypher.digitalax.xyz/item/chromadin/${preroll?.metadata?.title
                    ?.toLowerCase()
                    ?.replaceAll(" ", "_")
                    ?.replaceAll("_(print)", "")}`
                )
              }
              title={dict?.Common?.nft}
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
    </div>
  );
};

export default Preroll;

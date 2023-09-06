import { FunctionComponent } from "react";
import { CartItem, PreRollProps } from "../types/common.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import PrintTag from "./PrintTag";
import ColorChoice from "./ColorChoice";
import { setCart } from "../../../../redux/reducers/cartSlice";
import { setImageViewer } from "../../../../redux/reducers/imageViewerSlice";
import SizingChoice from "./SizingChoice";
import { setPreRoll } from "../../../../redux/reducers/preRollSlice";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";

const PreRoll: FunctionComponent<PreRollProps> = ({
  preRoll,
  dispatch,
  cartItems,
  preRolls,
  left,
  right,
  preRollAnim,
  imageLoading,
  setImagesLoading,
  index,
}): JSX.Element => {
  const profileImage = createProfilePicture(preRoll.uri.profile);
  return (
    <div className="relative w-48 flex flex-col h-fit gap-2">
      <div
        className={`relative w-48 xl:w-full h-fit flex flex-col rounded-sm border border-white p-3 gap-5 ${
          preRoll.newDrop &&
          "bg-[radial-gradient(at_center_bottom,_#00abfe,_#00cdc2,_#86a4b3,_#00CDC2)]"
        }`}
        id={preRollAnim ? "anim" : ""}
      >
        <div className="relative w-full h-60 xl:h-80 flex flex-col object-cover bg-cross bg-cover bg-center cursor-pointer">
          {preRoll?.uri?.image?.length > 0 &&
            (imageLoading ? (
              <div className="relative w-full h-full items-center justify-center flex flex-col"></div>
            ) : (
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${
                  preRoll?.uri?.image?.[preRoll?.currentIndex]?.split(
                    "ipfs://"
                  )[1]
                }`}
                decoding="async"
                layout="fill"
                objectFit="cover"
                draggable={false}
                alt="preRoll"
                priority
                onClick={() =>
                  dispatch(
                    setImageViewer({
                      actionValue: true,
                      actionImage:
                        preRoll?.uri?.image?.[preRoll?.currentIndex]?.split(
                          "ipfs://"
                        )[1],
                    })
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
                const updated = {
                  left: left
                    ? preRolls.left.map((obj) =>
                        obj.uri.image?.[0] === preRoll?.uri?.image?.[0]
                          ? {
                              ...obj,
                              currentIndex:
                                preRoll.currentIndex > 0
                                  ? preRoll.currentIndex - 1
                                  : preRoll?.uri?.image?.length - 1,
                            }
                          : obj
                      )
                    : preRolls.left,
                  right: right
                    ? preRolls.right.map((obj) =>
                        obj.uri.image?.[0] === preRoll?.uri?.image?.[0]
                          ? {
                              ...obj,
                              currentIndex:
                                preRoll?.currentIndex > 0
                                  ? preRoll?.currentIndex - 1
                                  : preRoll?.uri?.image?.length - 1,
                            }
                          : obj
                      )
                    : preRolls.right,
                };

                dispatch(
                  setPreRoll({
                    actionLeft: updated.left,
                    actionRight: updated.right,
                  })
                );
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
                const updated = {
                  left: left
                    ? preRolls.left.map((obj) =>
                        obj.uri.image?.[0] === preRoll?.uri?.image?.[0]
                          ? {
                              ...obj,
                              currentIndex:
                                preRoll.currentIndex <
                                preRoll?.uri?.image?.length - 1
                                  ? preRoll.currentIndex + 1
                                  : 0,
                            }
                          : obj
                      )
                    : preRolls.left,
                  right: right
                    ? preRolls.right.map((obj) =>
                        obj.uri.image?.[0] === preRoll?.uri?.image?.[0]
                          ? {
                              ...obj,
                              currentIndex:
                                preRoll.currentIndex <
                                preRoll?.uri?.image?.length - 1
                                  ? preRoll.currentIndex + 1
                                  : 0,
                            }
                          : obj
                      )
                    : preRolls.right,
                };

                dispatch(
                  setPreRoll({
                    actionLeft: updated.left,
                    actionRight: updated.right,
                  })
                );
              }}
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmcBVNVZWGBDcAxF4i564uSNGZrUvzhu5DKkXESvhY45m6`}
                layout="fill"
                draggable={false}
              />
            </div>
          </div>
          {preRoll.newDrop && (
            <div className="absolute bottom-2 right-2 bg-ama flex w-fit text-xxs h-fit px-2 py-1 text-black font-monu">
              🔥 new drop 🔥
            </div>
          )}
        </div>
        <div className="relative flex flex-row gap-2 w-full h-fit justify-between">
          <PrintTag
            backgroundColor={preRoll.bgColor}
            type={preRoll.printType}
          />
          <ColorChoice
            dispatch={dispatch}
            preRolls={preRolls}
            preRoll={preRoll}
            left={left}
            right={right}
          />
        </div>
        <SizingChoice
          dispatch={dispatch}
          preRolls={preRolls}
          preRoll={preRoll}
          left={left}
          right={right}
        />
        <div className="relative flex flex-row gap-2 w-full h-fit items-center">
          <div className="relative text-xl text-white font-aqua flex justify-start items-start w-fit h-fit">
            $
            {(preRoll?.printType === "shirt" ||
            preRoll?.printType === "hoodie" ||
            preRoll?.printType === "sleeve"
              ? preRoll.price?.[0]
              : preRoll.price?.[preRoll.sizes.indexOf(preRoll.chosenSize)]) /
              10 ** 18}
          </div>
          <div
            className="relative text-xl text-white font-aqua flex justify-end ml-auto w-5 items-center h-4 cursor-pointer active:scale-95"
            onClick={() => {
              let { colors, bgColor, ...newObj } = preRoll;
              const existing = [...cartItems].findIndex(
                (item) =>
                  item.collectionId === newObj.collectionId &&
                  item.chosenSize === newObj.chosenSize &&
                  item.chosenColor === newObj.chosenColor
              );

              let newCartItems: CartItem[] = [...cartItems];

              if (existing !== -1) {
                newCartItems = [
                  ...newCartItems.slice(0, existing),
                  {
                    ...newCartItems[existing],
                    amount: newCartItems[existing].amount + 1,
                  },
                  ...newCartItems.slice(existing + 1),
                ];
              } else {
                newCartItems.push({
                  ...newObj,
                  amount: 1,
                  uri: {
                    ...preRoll?.uri,
                    image: preRoll?.uri?.image?.[0],
                  },
                  price:
                    preRoll?.printType === "shirt" ||
                    preRoll?.printType === "hoodie" ||
                    preRoll?.printType === "sleeve"
                      ? preRoll.price?.[0]
                      : preRoll.price?.[
                          preRoll.sizes?.indexOf(preRoll.chosenSize)
                        ],
                });
              }

              dispatch(setCart(newCartItems));
            }}
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmcDmX2FmwjrhVDLpNii6NdZ4KisoPLMjpRUheB6icqZcV`}
              layout="fill"
              objectFit="cover"
              draggable={false}
              alt="preRoll"
            />
          </div>
        </div>
      </div>
      <div className="relative w-full h-10 flex flex-row border border-white p-1.5 items-center justify-between gap-3">
        <div
          className="relative w-fit h-fit flex flex-row gap-1.5 items-center justify-center cursor-pointer"
          onClick={() =>
            window.open(
              `https://www.chromadin.xyz/autograph/${
                preRoll?.uri?.profile?.handle?.split(".lens")[0]
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
            @{preRoll?.uri?.profile?.handle?.split(".lens")[0]}
          </div>
        </div>
        {preRoll?.uri?.chromadinCollectionName && (
          <div className="relative w-fit h-fit flex items-center justify-center">
            <div
              className="relative flex rounded-full w-5 h-5 bg-black border border-ama items-center justify-center cursor-pointer"
              onClick={() =>
                window.open(
                  `https://www.chromadin.xyz/autograph/${
                    preRoll?.uri?.profile?.handle?.split(".lens")[0]
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
    </div>
  );
};

export default PreRoll;

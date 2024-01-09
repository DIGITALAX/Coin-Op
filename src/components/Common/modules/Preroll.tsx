import { FunctionComponent } from "react";
import { CartItem, PrerollProps } from "../types/common.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY, printTypeToString } from "../../../../lib/constants";
import PrintTag from "./PrintTag";
import ColorChoice from "./ColorChoice";
import { setCart } from "../../../../redux/reducers/cartSlice";
import { setImageViewer } from "../../../../redux/reducers/imageViewerSlice";
import SizingChoice from "./SizingChoice";
import { setPreroll } from "../../../../redux/reducers/prerollSlice";
import createProfilePicture from "../../../../lib/lens/helpers/createProfilePicture";
import { setCartAddAnim } from "../../../../redux/reducers/cartAddAnimSlice";
import InteractBar from "./Lens/InteractBar";
import { setModalOpen } from "../../../../redux/reducers/modalOpenSlice";

const Preroll: FunctionComponent<PrerollProps> = ({
  preroll,
  dispatch,
  cartItems,
  prerolls,
  left,
  right,
  prerollAnim,
  imageLoading,
  setImagesLoading,
  index,
  cartAddAnim,
  interactionsLoading,
  mirror,
  like,
  openMirrorChoice,
  setOpenMirrorChoice,
}): JSX.Element => {
  const profileImage = createProfilePicture(
    preroll?.profile?.metadata?.picture
  );
  return (
    <div className="relative w-48 flex flex-col h-fit gap-2">
      <div
        className={`relative w-48 xl:w-full h-fit flex flex-col rounded-sm border border-white p-3 gap-5 ${
          preroll.newDrop &&
          "bg-[radial-gradient(at_center_bottom,_#00abfe,_#00cdc2,_#86a4b3,_#00CDC2)]"
        }`}
        id={prerollAnim ? "anim" : ""}
      >
        <div className="relative flex flex-col gap-2 w-full h-fit">
          <div className="relative w-full h-fit flex items-end justify-end font-monu text-xxs text-white">
            <div className="relative w-fit h-fit ml-0 flex items-center justify-center">{`${Number(
              preroll?.soldTokens || 0
            )} / ${Number(preroll?.amount)}`}</div>
          </div>
          <div className="relative w-full h-60 xl:h-80 flex flex-col object-cover bg-cross bg-cover bg-center cursor-pointer">
            {preroll?.collectionMetadata?.images?.length > 0 &&
              (imageLoading ? (
                <div className="relative w-full h-full items-center justify-center flex flex-col"></div>
              ) : (
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${
                    preroll?.collectionMetadata?.images?.[
                      preroll?.currentIndex
                    ]?.split("ipfs://")[1]
                  }`}
                  decoding="async"
                  layout="fill"
                  objectFit="cover"
                  draggable={false}
                  alt="preroll"
                  priority
                  onClick={() =>
                    dispatch(
                      setImageViewer({
                        actionValue: true,
                        actionImage:
                          preroll?.collectionMetadata?.images?.[
                            preroll?.currentIndex
                          ]?.split("ipfs://")[1],
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
            {preroll?.collectionMetadata?.images?.length > 1 && (
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
                        ? prerolls.left.map((obj) =>
                            obj.collectionMetadata.images?.[0] ===
                            preroll?.collectionMetadata?.images?.[0]
                              ? {
                                  ...obj,
                                  currentIndex:
                                    preroll.currentIndex > 0
                                      ? preroll.currentIndex - 1
                                      : preroll?.collectionMetadata?.images
                                          ?.length - 1,
                                }
                              : obj
                          )
                        : prerolls.left,
                      right: right
                        ? prerolls.right.map((obj) =>
                            obj.collectionMetadata.images?.[0] ===
                            preroll?.collectionMetadata?.images?.[0]
                              ? {
                                  ...obj,
                                  currentIndex:
                                    preroll?.currentIndex > 0
                                      ? preroll?.currentIndex - 1
                                      : preroll?.collectionMetadata?.images
                                          ?.length - 1,
                                }
                              : obj
                          )
                        : prerolls.right,
                    };

                    dispatch(
                      setPreroll({
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
                        ? prerolls.left.map((obj) =>
                            obj.collectionMetadata.images?.[0] ===
                            preroll?.collectionMetadata?.images?.[0]
                              ? {
                                  ...obj,
                                  currentIndex:
                                    preroll.currentIndex <
                                    preroll?.collectionMetadata?.images
                                      ?.length -
                                      1
                                      ? preroll.currentIndex + 1
                                      : 0,
                                }
                              : obj
                          )
                        : prerolls.left,
                      right: right
                        ? prerolls.right.map((obj) =>
                            obj.collectionMetadata.images?.[0] ===
                            preroll?.collectionMetadata?.images?.[0]
                              ? {
                                  ...obj,
                                  currentIndex:
                                    preroll.currentIndex <
                                    preroll?.collectionMetadata?.images
                                      ?.length -
                                      1
                                      ? preroll.currentIndex + 1
                                      : 0,
                                }
                              : obj
                          )
                        : prerolls.right,
                    };

                    dispatch(
                      setPreroll({
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
            )}

            {preroll.newDrop && (
              <div className="absolute bottom-2 right-2 bg-ama flex w-fit text-xxs h-fit px-2 py-1 text-black font-monu">
                🔥 new drop 🔥
              </div>
            )}
          </div>
        </div>
        <div className="relative flex flex-row gap-2 w-full h-fit justify-between">
          <PrintTag
            backgroundColor={preroll.bgColor}
            type={printTypeToString[Number(preroll.printType)]}
          />
          <ColorChoice
            dispatch={dispatch}
            prerolls={prerolls}
            preroll={preroll}
            left={left}
            right={right}
          />
        </div>
        <SizingChoice
          dispatch={dispatch}
          prerolls={prerolls}
          preroll={preroll}
          left={left}
          right={right}
        />
        <div className="relative flex flex-row gap-2 w-full h-fit items-center">
          <div className="relative text-xl text-white font-aqua flex justify-start items-start w-fit h-fit">
            $
            {preroll?.printType !== "0" && preroll?.printType !== "1"
              ? Number(preroll.prices?.[0])
              : Number(
                  preroll?.prices?.[
                    preroll?.collectionMetadata?.sizes?.indexOf(
                      preroll?.chosenSize
                    ) || 0
                  ]
                )}
          </div>
          <div
            className="relative text-xl text-white font-aqua flex justify-end ml-auto w-5 items-center h-4 cursor-pointer active:scale-95"
            id={
              cartAddAnim === preroll?.collectionMetadata?.images[0]
                ? "cartAddAnim"
                : ""
            }
            onClick={() => {
              const existing = [...cartItems].findIndex(
                (item) =>
                  item?.item?.collectionId === preroll.collectionId &&
                  item.chosenSize === preroll.chosenSize &&
                  item.chosenColor === preroll.chosenColor
              );

              let newCartItems: CartItem[] = [...cartItems];

              if (
                cartItems
                  ?.filter(
                    (item) =>
                      item?.item?.pubId == newCartItems?.[existing]?.item?.pubId
                  )
                  ?.reduce(
                    (accumulator, currentItem) =>
                      accumulator + currentItem.chosenAmount,
                    0
                  ) +
                  1 >
                  Number(newCartItems?.[existing]?.item?.amount) ||
                Number(newCartItems?.[existing]?.item?.amount) ==
                  Number(newCartItems?.[existing]?.item?.soldTokens)
              ) {
                dispatch(
                  setModalOpen({
                    actionOpen: true,
                    actionMessage:
                      "We know you're eager, but you've reached this prints' collect limit!",
                  })
                );
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
                      : preroll?.collectionMetadata?.sizes?.indexOf(
                          preroll.chosenSize
                        ),
                });
              }

              dispatch(setCart(newCartItems));
              dispatch(setCartAddAnim(preroll?.collectionMetadata?.images[0]));
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
      <InteractBar
        dispatch={dispatch}
        openMirrorChoice={openMirrorChoice}
        setOpenMirrorChoice={setOpenMirrorChoice}
        like={like}
        mirror={mirror}
        publication={preroll}
        index={index}
        interactionsLoading={interactionsLoading}
        cartItems={cartItems}
      />
      <div className="relative w-full h-10 flex flex-row border border-white p-1.5 items-center justify-between gap-3">
        <div
          className="relative w-fit h-fit flex flex-row gap-1.5 items-center justify-center cursor-pointer"
          onClick={() =>
            window.open(
              `https://cypher.digitalax.xyz/autograph/${
                preroll?.profile?.handle?.suggestedFormatted?.localName?.split(
                  "@"
                )[1]
              }`
            )
          }
        >
          <div className="relative flex rounded-full w-5 h-5 bg-black border border-ama items-center justify-center">
            {profileImage && (
              <Image
                className="rounded-full"
                src={profileImage}
                layout="fill"
                objectFit="cover"
                draggable={false}
              />
            )}
          </div>
          <div className="text-ama w-fit h-fit flex items-center justify-center font-monu text-xxs">
            {preroll?.profile?.handle?.suggestedFormatted?.localName}
          </div>
        </div>
        {preroll?.collectionMetadata?.onChromadin == "yes" && (
          <div className="relative w-fit h-fit flex items-center justify-center">
            <div
              className="relative flex rounded-full w-5 h-5 bg-black border border-ama items-center justify-center cursor-pointer"
              onClick={() =>
                window.open(
                  `https://cypher.digitalax.xyz/item/chromadin/${preroll?.collectionMetadata?.title
                    ?.toLowerCase()
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
    </div>
  );
};

export default Preroll;

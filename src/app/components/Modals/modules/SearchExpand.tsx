import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { ImCross } from "react-icons/im";
import { AiOutlineCode } from "react-icons/ai";
import copy from "copy-to-clipboard";
import { BiCopy } from "react-icons/bi";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY, printTypeToString } from "@/app/lib/constants";
import { usePathname, useRouter } from "next/navigation";
import PrintTag from "../../Prerolls/modules/PrintTag";
import ColorChoice from "../../Prerolls/modules/ColorChoice";
import SizingChoice from "../../Prerolls/modules/SizingChoice";
import { CartItem } from "../../Prerolls/types/prerolls.types";
import useRollSearch from "../../Common/hooks/useRollSearch";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";

const SearchExpand: FunctionComponent<{
  dict: any;
}> = ({ dict }): JSX.Element => {
  const router = useRouter();
  const path = usePathname();
  const context = useContext(ModalContext);
  const { handlePromptChoose } = useRollSearch(dict);
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm grid grid-flow-col auto-cols-auto w-full h-auto overflow-y-auto">
      <div className="relative w-full lg:w-fit h-fit col-start-1 place-self-center bg-black rounded-lg">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full sm:w-fit h-full grid grid-flow-row auto-rows-auto gap-4 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={12}
                  onClick={() => context?.setSearchExpand(undefined)}
                />
              </div>
              <div className="relative w-[90vw] sm:w-fit h-full flex flex-col items-center sm:items-start justify-center px-4 gap-4">
                <div className="relative w-full h-fit flex flex-col sm:flex-row items-center sm:items-start justify-center gap-6">
                  <div className="relative w-full sm:w-80 h-80 rounded-md border border-white/70 p-3 flex items-center justify-center sm:justify-start">
                    <div
                      className="relative w-full h-full object-cover flex items-center justify-start cursor-pointer"
                      onClick={() =>
                        context?.setVerImagen(
                          `${INFURA_GATEWAY}/ipfs/${
                            context?.searchExpand?.metadata?.images?.[0]?.split(
                              "ipfs://"
                            )[1]
                          }`
                        )
                      }
                    >
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/${
                          context?.searchExpand?.metadata?.images?.[0]?.split(
                            "ipfs://"
                          )[1]
                        }`}
                        layout="fill"
                        objectFit="cover"
                        objectPosition={"top"}
                        alt="searchPrompt"
                        draggable={false}
                      />
                    </div>
                  </div>
                  <div className="relative w-full sm:w-fit h-fit sm:h-full flex flex-col text-center sm:text-right text-white font-mana items-end justify-center gap-3 sm:gap-6">
                    <div className="relative w-fit h-fit flex flex-row gap-2">
                      <div
                        className="relative flex cursor-pointer active:scale-95 hover:opacity-50 items-center justify-center"
                        title="use prompt"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (path.includes("account")) {
                            router.prefetch("/");
                            router.push("/");
                          }
                          handlePromptChoose(context?.searchExpand!);
                          context?.setSearchExpand(undefined);
                        }}
                      >
                        <AiOutlineCode color="white" size={16} />
                      </div>
                    </div>
                    <div className="relative w-fit h-fit flex flex-row items-center justify-between gap-3">
                      <div
                        className="relative w-fit h-fit flex flex-row gap-1.5 items-center justify-center cursor-pointer"
                        onClick={() =>
                          window.open(
                            `https://cypher.digitalax.xyz/autograph/${
                              context?.searchExpand?.profile?.username?.localName?.split(
                                "@"
                              )[1]
                            }`
                          )
                        }
                      >
                        <div className="relative flex rounded-full w-5 h-5 bg-black border border-ama items-center justify-center">
                          <Image
                            className="rounded-full"
                            src={handleProfilePicture(
                              context?.searchExpand?.profile?.metadata?.picture
                            )}
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div className="text-ama w-fit h-fit flex items-center justify-center font-monu text-xxs">
                          {context?.searchExpand?.profile?.username?.localName}
                        </div>
                      </div>
                      {context?.searchExpand?.metadata?.title && (
                        <div className="relative w-fit h-fit flex items-center justify-center">
                          <div
                            className="relative flex rounded-full w-5 h-5 bg-black border border-ama items-center justify-center cursor-pointer"
                            onClick={() =>
                              window.open(
                                `https://cypher.digitalax.xyz/item/chromadin/${context?.searchExpand?.metadata?.title
                                  ?.toLowerCase()
                                  ?.replaceAll(" ", "_")
                                  ?.replaceAll("_(print)", "")}`
                              )
                            }
                            title={"nft"}
                          >
                            <Image
                              className="rounded-full"
                              src={
                                "https://ik.imagekit.io/lens/media-snapshot/71fa64480da4a5be0d7904712715f2ba19bb8aad4fdfecc4616572e8ffef0101.png"
                              }
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <PrintTag
                      dict={dict}
                      backgroundColor={context?.searchExpand?.bgColor!}
                      type={
                        printTypeToString[
                          Number(context?.searchExpand?.printType)
                        ]
                      }
                    />
                    <ColorChoice
                      preroll={context?.searchExpand!}
                      left={
                        context?.prerolls.left?.indexOf(context?.searchExpand!)
                          ? true
                          : false
                      }
                      right={
                        context?.prerolls?.right?.indexOf(
                          context?.searchExpand!
                        )
                          ? true
                          : false
                      }
                      search
                    />
                    <div className="relative justify-end items-end w-fit h-fit flex">
                      <SizingChoice
                        preroll={context?.searchExpand!}
                        left={
                          context?.prerolls.left?.indexOf(
                            context?.searchExpand!
                          )
                            ? true
                            : false
                        }
                        right={
                          context?.prerolls.right?.indexOf(
                            context?.searchExpand!
                          )
                            ? true
                            : false
                        }
                        search
                      />
                    </div>
                    <div className="relative text-xl text-white font-aqua flex justify-end items-end w-fit h-fit">
                      $
                      {context?.searchExpand?.printType !== "0" &&
                      context?.searchExpand?.printType !== "1"
                        ? Number(context?.searchExpand?.price)
                        : Number(context?.searchExpand?.price)}
                    </div>
                    <div
                      className="relative text-xl text-white font-aqua flex justify-end ml-auto w-5 items-center h-4 cursor-pointer active:scale-95"
                      onClick={() => {
                        const existing = [
                          ...(context?.cartItems || []),
                        ].findIndex(
                          (item) =>
                            item.item?.collectionId ===
                              context?.searchExpand?.collectionId &&
                            item.chosenSize ===
                              context?.searchExpand?.chosenSize &&
                            item.chosenColor ===
                              context?.searchExpand?.chosenColor
                        );

                        let newCartItems: CartItem[] = [
                          ...(context?.cartItems || []),
                        ];

                        if (
                          (context?.cartItems || [])
                            ?.filter(
                              (item) =>
                                item?.item?.postId ==
                                newCartItems?.[existing]?.item?.postId
                            )
                            ?.reduce(
                              (accumulator, currentItem) =>
                                accumulator + currentItem.chosenAmount,
                              0
                            ) +
                            1 >
                            Number(newCartItems?.[existing]?.item?.amount) ||
                          Number(newCartItems?.[existing]?.item?.amount) ==
                            Number(
                              newCartItems?.[existing]?.item?.tokenIdsMinted
                                ?.length || 0
                            )
                        ) {
                          context?.setModalOpen(undefined);

                          return;
                        }

                        if (existing !== -1) {
                          newCartItems = [
                            ...newCartItems.slice(0, existing),
                            {
                              ...newCartItems[existing],
                              chosenAmount:
                                newCartItems[existing].chosenAmount + 1,
                            },
                            ...newCartItems.slice(existing + 1),
                          ];
                        } else {
                          newCartItems.push({
                            item: context?.searchExpand!,
                            chosenColor: context?.searchExpand?.chosenColor!,
                            chosenSize: context?.searchExpand?.chosenSize!,
                            chosenAmount: 1,
                            chosenIndex:
                              context?.searchExpand?.printType !== "0" &&
                              context?.searchExpand?.printType !== "1"
                                ? 0
                                : context?.searchExpand?.metadata?.sizes?.indexOf(
                                    context?.searchExpand?.chosenSize
                                  ),
                          });
                        }

                        context?.setCartItems(newCartItems);

                        context?.setCartAddAnim(
                          context?.searchExpand?.metadata?.images[0]
                        );
                      }}
                      id={
                        context?.cartAddAnim ===
                        context?.searchExpand?.metadata?.images[0]
                          ? "cartAddAnim"
                          : ""
                      }
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
                {context?.searchExpand?.metadata?.prompt && (
                  <div className="relative w-full h-52 items-start justify-center flex flex-col gap-1.5 border border-white rounded-md">
                    <textarea
                      disabled={true}
                      className="bg-black w-full relative flex h-full p-3 text-center font-mana text-white text-xs rounded-md break-words"
                      placeholder={context?.searchExpand?.metadata?.prompt}
                      style={{ resize: "none" }}
                    ></textarea>
                    <div
                      className="relative w-fit h-fit flex items-center ml-auto cursor-pointer active:scale-95 bottom-2 right-2"
                      onClick={() =>
                        copy(context?.searchExpand?.metadata?.prompt!)
                      }
                    >
                      <BiCopy size={15} color="white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchExpand;

import { FunctionComponent } from "react";
import { CartItem, SearchExpandProps } from "../../types/common.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { ImCross } from "react-icons/im";
import { setSearchExpand } from "../../../../../redux/reducers/searchExpandSlice";
import { setCart } from "../../../../../redux/reducers/cartSlice";
import PrintTag from "../PrintTag";
import ColorChoice from "../ColorChoice";
import SizingChoice from "../SizingChoice";
import { setImageViewer } from "../../../../../redux/reducers/imageViewerSlice";
import { AiOutlineCode } from "react-icons/ai";
import { ImRedo } from "react-icons/im";
import copy from "copy-to-clipboard";
import { BiCopy } from "react-icons/bi";

const SearchExpand: FunctionComponent<SearchExpandProps> = ({
  searchItem,
  dispatch,
  cartItems,
  preRolls,
  handleSearchSimilar,
  handlePromptChoose,
  router,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full lg:w-fit h-fit col-start-1 place-self-center bg-black rounded-lg">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-fit h-full grid grid-flow-row auto-rows-auto gap-4 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={12}
                  onClick={() => dispatch(setSearchExpand(undefined))}
                />
              </div>
              <div className="relative w-fit h-full flex flex-col items-start justify-center px-4 gap-4">
                <div className="relative w-fit h-fit flex flex-row items-start justify-center gap-6">
                  <div className="relative w-80 h-80 rounded-md border border-white/70 p-3 flex items-center justify-start">
                    <div
                      className="relative w-full h-full object-cover flex items-center justify-start cursor-pointer"
                      onClick={() =>
                        dispatch(
                          setImageViewer({
                            actionValue: open,
                            actionImage:
                              searchItem?.uri?.image?.[0]?.split("ipfs://")[1],
                          })
                        )
                      }
                    >
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/${
                          searchItem?.uri?.image?.[0]?.split("ipfs://")[1]
                        }`}
                        layout="fill"
                        objectFit="cover"
                        alt="searchPrompt"
                        draggable={false}
                      />
                    </div>
                  </div>
                  <div className="relative w-full h-full flex flex-col text-right text-white font-mana items-end justify-center gap-6">
                    <div className="relative w-fit h-fit flex flex-row gap-2">
                      <div
                        className="relative flex cursor-pointer active:scale-95 hover:opacity-50 items-center justify-center"
                        title="use prompt"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (router.asPath.includes("account") ||
                          router.asPath.includes("pregame") ||
                          router.asPath.includes("quests")
                        ) {
                            await router.push("/");
                          }
                          handlePromptChoose(searchItem);
                          dispatch(setSearchExpand(undefined));
                        }}
                      >
                        <AiOutlineCode color="white" size={16} />
                      </div>
                      <div
                        className="relative flex cursor-pointer active:scale-95 hover:opacity-50 items-center justify-center"
                        title="add to search"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSearchSimilar(searchItem);
                          dispatch(setSearchExpand(undefined));
                        }}
                      >
                        <ImRedo color="white" size={12} />
                      </div>
                    </div>
                    <div className="relative w-fit h-fit flex font-herm text-3xl">
                      {searchItem.uri.category}
                    </div>
                    <PrintTag
                      backgroundColor={searchItem.bgColor}
                      type={searchItem.printType}
                    />
                    <ColorChoice
                      dispatch={dispatch}
                      preRolls={preRolls}
                      preRoll={searchItem}
                      left={preRolls.left?.indexOf(searchItem) ? true : false}
                      right={preRolls.right?.indexOf(searchItem) ? true : false}
                    />
                    <div className="relative justify-end items-end w-fit h-fit flex">
                      <SizingChoice
                        dispatch={dispatch}
                        preRolls={preRolls}
                        preRoll={searchItem}
                        left={preRolls.left?.indexOf(searchItem) ? true : false}
                        right={
                          preRolls.right?.indexOf(searchItem) ? true : false
                        }
                      />
                    </div>
                    <div className="relative text-xl text-white font-aqua flex justify-end items-end w-fit h-fit">
                      $
                      {(searchItem?.printType === "shirt" ||
                      searchItem?.printType === "hoodie"
                        ? searchItem.price?.[0]
                        : searchItem.price?.[
                            searchItem.sizes.indexOf(searchItem.chosenSize)
                          ]) /
                        10 ** 18}
                    </div>
                    <div
                      className="relative text-xl text-white font-aqua flex justify-end ml-auto w-5 items-center h-4 cursor-pointer active:scale-95"
                      onClick={() => {
                        let { colors, bgColor, ...newObj } = searchItem;
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
                              ...searchItem?.uri,
                              image: searchItem?.uri?.image?.[0],
                            },
                            price:
                              searchItem?.printType === "shirt" ||
                              searchItem?.printType === "hoodie"
                                ? searchItem.price?.[0]
                                : searchItem.price?.[
                                    searchItem.sizes?.indexOf(
                                      searchItem.chosenSize
                                    )
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
                <div className="relative w-full h-52 items-start justify-center flex flex-col gap-1.5 border border-white rounded-md">
                  <textarea
                    disabled={true}
                    className="bg-black w-full relative flex h-full p-3 text-center font-mana text-white text-xs rounded-md "
                    placeholder={searchItem?.uri?.prompt}
                    style={{ resize: "none" }}
                  ></textarea>
                  <div
                    className="relative w-fit h-fit flex items-center ml-auto cursor-pointer active:scale-95 bottom-2 right-2"
                    onClick={() => copy(searchItem?.uri?.prompt)}
                  >
                    <BiCopy size={15} color="white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchExpand;

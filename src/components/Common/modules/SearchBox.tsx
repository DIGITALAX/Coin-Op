import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { SearchBoxProps } from "../types/common.types";
import { CgArrowsExpandUpLeft } from "react-icons/cg";
import { setSearchExpand } from "../../../../redux/reducers/searchExpandSlice";
import { AiOutlineCode } from "react-icons/ai";
import { ImRedo } from "react-icons/im";

const SearchBox: FunctionComponent<SearchBoxProps> = ({
  promptSearch,
  searchLoading,
  dispatch,
  handlePromptChoose,
  handleAddToCart,
  router,
  cartAddAnim,
}): JSX.Element => {
  return (
    <div className="relative w-40 h-40 rounded-md border border-white/70 p-3">
      <div className="relative w-full h-full object-cover">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/${
            promptSearch?.collectionMetadata?.images[0]?.split("ipfs://")[1]
          }`}
          layout="fill"
          objectFit="cover"
          alt="searchPrompt"
          draggable={false}
        />
        <div className="absolute w-full h-full flex flex-col top-0 left-0 p-1 justify-between">
          <div
            className="relative w-fit h-fit flex hover:opacity-50 cursor-pointer"
            title="view item"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setSearchExpand(promptSearch));
            }}
          >
            <CgArrowsExpandUpLeft size={16} color="white" />
          </div>
          <div className="relative w-full h-fit bottom-0 flex flex-row justify-between">
            <div className="relative w-fit h-fit flex flex-row gap-2">
              <div
                className="relative flex cursor-pointer active:scale-95 hover:opacity-50 items-center justify-center"
                title="use prompt"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (router.asPath.includes("account")) {
                    await router.push("/");
                  }
                  handlePromptChoose(promptSearch);
                }}
              >
                <AiOutlineCode color="white" size={16} />
              </div>
            </div>
            <div
              className="relative flex items-center justify-center w-4 h-3.5 cursor-pointer active:scale-95 hover:opacity-50"
              title="add to cart"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(promptSearch);
              }}
              id={
                cartAddAnim === promptSearch?.collectionMetadata?.images[0]
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
                className="flex items-center justify-center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;

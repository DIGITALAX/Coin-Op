import { ChangeEvent, FunctionComponent } from "react";
import { Preroll, RollSearchProps } from "../types/common.types";
import SearchBox from "./SearchBox";
import { AiOutlineLoading } from "react-icons/ai";

const RollSearch: FunctionComponent<RollSearchProps> = ({
  rollSearch,
  handleRollSearch,
  prompt,
  setPrompt,
  handlePromptChoose,
  searchLoading,
  dispatch,
  handleAddToCart,
  router,
  cartAddAnim,
  t,
}): JSX.Element => {
  return (
    <div className="relative w-3/4 flex flex-col justify-start h-fit gap-4 sm:pb-28 order-2">
      <input
        className="bg-black font-mega text-white text-xs w-full rounded-full flex py-1 px-4 h-12 border border-white"
        placeholder={t("graff")}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setPrompt(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.stopPropagation();
            handleRollSearch();
          }
        }}
        value={prompt || ""}
      />
      <div
        className="relative items-center justify-center rounded-sm bg-white text-black font-mega text-xs cursor-pointer active:scale-95 px-1.5 py-1 w-32 h-8 items-center flex hover:opacity-70"
        onClick={() => handleRollSearch()}
      >
        <div
          className={`relative w-fit h-fit flex items-center justify-center ${
            searchLoading && "animate-spin"
          }`}
        >
          {searchLoading ? (
            <AiOutlineLoading color="black" size={15} />
          ) : (
            t("search")
          )}
        </div>
      </div>
      <div
        className={`relative flex flex-col w-full h-48 justify-start items-start overflow-y-scroll ${
          rollSearch?.length > 0 ? "flex" : "hidden sm:flex"
        }`}
      >
        {rollSearch?.length > 0 && (
          <div className="relative inline-flex flex-wrap gap-6 pt-6 justify-start items-center">
            {rollSearch?.map((roll: Preroll, index: number) => {
              return (
                <SearchBox
                  t={t}
                  key={index}
                  promptSearch={roll}
                  handlePromptChoose={handlePromptChoose}
                  searchLoading={searchLoading}
                  dispatch={dispatch}
                  handleAddToCart={handleAddToCart}
                  router={router}
                  cartAddAnim={cartAddAnim}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RollSearch;

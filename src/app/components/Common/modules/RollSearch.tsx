import { ChangeEvent, FunctionComponent, JSX, useContext } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Preroll } from "../../Prerolls/types/prerolls.types";
import useRollSearch from "../hooks/useRollSearch";
import { SynthContext } from "@/app/providers";
import SearchBox from "./SearchBox";

const RollSearch: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const synthContext = useContext(SynthContext);
  const {
    handleRollSearch,
    prompt,
    setPrompt,
    handlePromptChoose,
    handleAddToCart,
    searchLoading,
  } = useRollSearch(dict);
  return (
    <div className="relative w-3/4 flex flex-col justify-start h-fit gap-4 sm:pb-28 order-2">
      <input
        className="bg-black font-mega text-white text-xs w-full rounded-full flex py-1 px-4 h-12 border border-white"
        placeholder={dict?.Common?.graff}
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
            dict?.Common?.search
          )}
        </div>
      </div>
      <div
        className={`relative flex flex-col w-full h-48 justify-start items-start overflow-y-scroll ${
          Number(synthContext?.rollSearch?.length) > 0
            ? "flex"
            : "hidden sm:flex"
        }`}
      >
        {Number(synthContext?.rollSearch?.length) > 0 && (
          <div className="relative inline-flex flex-wrap gap-6 pt-6 justify-start items-center">
            {synthContext?.rollSearch?.map((roll: Preroll, index: number) => {
              return (
                <SearchBox
                  handleAddToCart={handleAddToCart}
                  handlePromptChoose={handlePromptChoose}
                  dict={dict}
                  key={index}
                  promptSearch={roll}
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

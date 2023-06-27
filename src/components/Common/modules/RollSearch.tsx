import { ChangeEvent, FunctionComponent } from "react";
import { RollSearch, RollSearchProps } from "../types/common.types";
import SearchBox from "./SearchBox";
import Image from "next/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";

const RollSearch: FunctionComponent<RollSearchProps> = ({
  rollSearch,
  handleRollSearch,
  prompt,
  setPrompt,
}): JSX.Element => {
  return (
    <div className="relative w-3/4 flex flex-col justify-start h-fit gap-4">
      <input
        className="bg-black font-mega text-white text-xs w-full rounded-full flex py-1 px-4 h-12 border border-white"
        placeholder={`graffiti on a wall in LES, illustration, digital art, breakcore`}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setPrompt(e.target.value)
        }
        defaultValue={prompt}
      />
      <div
        className="relative justify-start rounded-sm bg-white text-black font-mega text-xs cursor-pointer active:scale-95 px-1.5 py-1 w-fit h-8 items-center flex hover:opacity-70"
        onClick={() => handleRollSearch()}
      >
        search prompts
      </div>
      <div className="relative flex w-full h-44 justify-start items-center">
        {rollSearch?.length > 0 && (
          <div className="relative inline-flex flex-wrap gap-3 pt-6 justify-start items-center">
            {rollSearch.map((roll: RollSearch, index: number) => {
              return <SearchBox key={index} promptSearch={roll} />;
            })}
            <div className="relative w-20 h-8 flex">
              <Image
                alt="seeAll"
                fill
                src={`${INFURA_GATEWAY}/ipfs/QmXvzWPiUqMw6umcS3Qp6yXCTwLzZtbXcWH8fKE6i3ZFpY`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RollSearch;

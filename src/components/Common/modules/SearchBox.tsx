import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { SearchBoxProps } from "../types/common.types";

const SearchBox: FunctionComponent<SearchBoxProps> = ({
  promptSearch,
  handlePromptChoose,
}): JSX.Element => {
  return (
    <div className="relative w-40 h-40 rounded-md border border-white/70 p-3 cursor-pointer">
      <div
        className="relative w-full h-full object-cover hover:opacity-80"
        onClick={() => handlePromptChoose(promptSearch)}
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/${promptSearch.uri}`}
          layout="fill"
          objectFit="cover"
          alt="searchPrompt"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default SearchBox;

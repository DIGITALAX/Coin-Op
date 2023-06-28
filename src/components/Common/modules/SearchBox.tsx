import Image from "next/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { SearchBoxProps } from "../types/common.types";

const SearchBox: FunctionComponent<SearchBoxProps> = ({
  promptSearch,
}): JSX.Element => {
  return (
    <div className="relative w-40 h-40 rounded-md border border-white/70 px-3 cursor-pointer">
      <div className="relative w-full h-full object-cover hover:opacity-80">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/${promptSearch.template.image}`}
          fill
          alt="searchPrompt"
        />
      </div>
    </div>
  );
};

export default SearchBox;

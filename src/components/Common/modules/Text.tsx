import { FunctionComponent } from "react";
import descriptionRegex from "../../../../lib/lens/helpers/descriptionRegex";
import { TextProps } from "../types/common.types";

const Text: FunctionComponent<TextProps> = ({ metadata }): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col justify-start items-center gap-3">
      <div
        className={`relative w-full h-fit max-h-[20rem] font-sat text-white text-left items-start justify-start break-words flex overflow-y-scroll p-3 text-sm whitespace-preline ${
          metadata?.__typename !== "TextOnlyMetadataV3" &&
          metadata?.content?.length > 200
            ? "bg-black"
            : "bg-oscuro"
        }`}
        dangerouslySetInnerHTML={{
          __html: descriptionRegex(
            metadata?.content,
            metadata?.__typename !== "TextOnlyMetadataV3" &&
              metadata?.content?.length > 200
              ? false
              : true
          ),
        }}
      ></div>
    </div>
  );
};

export default Text;

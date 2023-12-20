import { FunctionComponent } from "react";
import descriptionRegex from "../../../../lib/lens/helpers/descriptionRegex";
import { setImageViewer } from "../../../../redux/reducers/imageViewerSlice";
import { PublicationMetadataMedia } from "../types/generated";
import { metadataMedia } from "../../../../lib/lens/helpers/postMetadata";
import MediaSwitch from "./MediaSwitch";
import { ImageProps } from "../types/common.types";

const Media: FunctionComponent<ImageProps> = ({
  dispatch,
  metadata,
  disabled,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col justify-start items-center gap-3 break-words max-w-full">
      {metadata?.content && metadata?.content?.trim() !== "" && (
        <div
          className={`relative w-full h-fit max-h-[12rem] font-sat  text-left items-start justify-start break-words flex overflow-y-scroll p-3 text-sm whitespace-preline bg-offBlack text-white`}
          dangerouslySetInnerHTML={{
            __html: descriptionRegex(
              metadata?.content,
              metadata?.__typename === "VideoMetadataV3" ? true : false
            ),
          }}
        ></div>
      )}
      <div
        className={`relative w-full h-fit overflow-x-scroll gap-2 items-center justify-start flex`}
      >
        <div className="relative w-fit h-fit gap-2 flex flex-row items-center justify-start">
          {[metadata?.asset, ...(metadata?.attachments || [])]
            ?.filter(Boolean)
            ?.map((item: PublicationMetadataMedia, index: number) => {
              const media = metadataMedia(item);

              return (
                <div
                  key={index}
                  className={`w-60 border border-white rounded-sm h-60 flex items-center justify-center bg-offBlack ${
                    media?.url && !disabled && "cursor-pointer"
                  }`}
                  onClick={() =>
                    media?.type === "Image" &&
                    !disabled &&
                    dispatch(
                      setImageViewer({
                        actionValue: true,
                        actionImage: media?.url,
                      })
                    )
                  }
                >
                  <div className="relative w-full h-full flex rounded-sm items-center justify-center">
                    {media?.url && (
                      <MediaSwitch
                        type={media?.type}
                        srcUrl={media?.url}
                        srcCover={media?.cover}
                        classNameVideo={
                          "rounded-sm absolute w-full h-full object-cover"
                        }
                        classNameImage={"rounded-sm"}
                        classNameAudio={"rounded-md"}
                      />
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Media;

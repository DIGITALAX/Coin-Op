import descriptionRegex from "@/app/lib/helpers/descriptionRegex";
import { ModalContext } from "@/app/providers";
import { FunctionComponent, JSX, useContext } from "react";
import { MediaProps } from "../types/modals.types";
import MediaSwitch from "./MediaSwitch";
import { MediaAudio, MediaVideo, MediaImage } from "@lens-protocol/client";
import { metadataMedia } from "@/app/lib/helpers/metadataMedia";

const Media: FunctionComponent<MediaProps> = ({
  metadata,
  disabled,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit flex flex-col justify-start items-center gap-3 break-words max-w-full">
      {metadata?.content && metadata?.content?.trim() !== "" && (
        <div
          className={`relative w-full h-fit max-h-[12rem] font-sat  text-left items-start justify-start break-words flex overflow-y-scroll p-3 text-sm whitespace-preline bg-offBlack text-white`}
          dangerouslySetInnerHTML={{
            __html: descriptionRegex(
              metadata?.content,
              metadata?.__typename === "VideoMetadata" ? true : false
            ),
          }}
        ></div>
      )}
      <div
        className={`relative w-full h-fit overflow-x-scroll gap-2 items-center justify-start flex`}
      >
        <div className="relative w-fit h-fit gap-2 flex flex-row items-center justify-start">
          {[
            metadata?.__typename == "ImageMetadata"
              ? metadata?.image
              : metadata?.__typename == "VideoMetadata"
              ? metadata?.video
              : metadata?.audio,
            ...(metadata?.attachments || []),
          ]
            ?.filter(Boolean)
            ?.map(
              (item: MediaAudio | MediaVideo | MediaImage, index: number) => {
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
                      context?.setVerImagen(media?.url)
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
              }
            )}
        </div>
      </div>
    </div>
  );
};

export default Media;

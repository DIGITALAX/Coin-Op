import { PublicationMetadataMainFocusType } from "@/components/Common/types/generated";
import { v4 as uuidv4 } from "uuid";

const uploadPostContent = async (
  contentText: string | undefined
): Promise<{ string: string; object: Object } | undefined> => {
  try {
    const object = {
      $schema:
        "https://json-schemas.lens.dev/publications/text-only/3.0.0.json",
      lens: {
        mainContentFocus: PublicationMetadataMainFocusType.TextOnly,
        title: contentText ? contentText.slice(0, 20) : "",
        content: contentText ? contentText : "",
        appId: "cyphersearch",
        id: uuidv4(),
        hideFromFeed: false,
        locale: "en",
      },
    };

    const response = await fetch("/api/ipfs", {
      method: "POST",
      body: JSON.stringify(object),
    });
    let responseJSON = await response.json();

    return {
      string: "ipfs://" + responseJSON?.cid,
      object,
    };
  } catch (err: any) {
    console.error(err.message);
  }
};

export default uploadPostContent;

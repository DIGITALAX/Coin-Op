import {
  ArticleMetadata,
  ImageMetadata,
  StoryMetadata,
  TextOnlyMetadata,
} from "@lens-protocol/client";
import { FunctionComponent, JSX } from "react";
import Text from "./Text";
import Media from "./Media";
import { PostSwitchProps } from "../types/modals.types";

const PostSwitch: FunctionComponent<PostSwitchProps> = ({
  item,
  disabled,
}): JSX.Element => {
  switch (
    item?.__typename === "Repost"
      ? item?.repostOf?.metadata?.__typename
      : item?.metadata?.__typename
  ) {
    case "ArticleMetadata":
    case "TextOnlyMetadata":
    case "StoryMetadata":
      return (
        <Text
          metadata={
            (item?.__typename === "Repost"
              ? item?.repostOf?.metadata
              : item?.metadata) as
              | ArticleMetadata
              | StoryMetadata
              | TextOnlyMetadata
          }
        />
      );

    default:
      return (
        <Media
          metadata={
            (item?.__typename === "Repost"
              ? item?.repostOf?.metadata
              : item?.metadata) as ImageMetadata
          }
          disabled={disabled}
        />
      );
  }
};

export default PostSwitch;

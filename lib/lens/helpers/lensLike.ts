import likePost from "../../../graphql/lens/mutations/like";
import { AnyAction, Dispatch } from "redux";
import handleIndexCheck from "../../../graphql/lens/queries/indexed";
import { PublicationReactionType } from "@/components/Common/types/generated";
import { setIndexModal } from "../../../redux/reducers/indexModalSlice";
import { TFunction } from "i18next";

const lensLike = async (
  id: string,
  dispatch: Dispatch<AnyAction>,
  downvote: boolean,
  t: TFunction<"common", undefined>
): Promise<void> => {
  const data = await likePost({
    for: id,
    reaction: downvote
      ? PublicationReactionType.Downvote
      : PublicationReactionType.Upvote,
  });

  if (
    data?.data?.addReaction?.__typename === "RelaySuccess" ||
    !data?.data?.addReaction
  ) {
    if (data?.data?.addReaction?.txId) {
      await handleIndexCheck(
        {
          forTxId: data?.data?.addReaction?.txId,
        },
        dispatch,
        t
      );
    } else {
      dispatch(
        setIndexModal({
          actionOpen: true,
          actionMessage: t("succ"),
        })
      );
      setTimeout(() => {
        dispatch(
          setIndexModal({
            actionOpen: false,
            actionMessage: undefined,
          })
        );
      }, 1000);
    }
  }
};

export default lensLike;

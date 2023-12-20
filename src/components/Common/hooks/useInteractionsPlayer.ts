import { useEffect, useState } from "react";
import {
  Comment,
  CommentRankingFilterType,
  LimitType,
  Profile,
} from "../types/generated";
import { MainVideoState } from "../../../../redux/reducers/mainVideoSlice";
import { IndexModalState } from "../../../../redux/reducers/indexModalSlice";
import getPublications from "../../../../graphql/lens/queries/publications";

const useInteractionsPlayer = (
  profile: Profile | undefined,
  mainVideo: MainVideoState,
  commentId: string | undefined,
  index: IndexModalState
) => {
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [paginated, setPaginated] = useState<any>();
  const [commentors, setCommentors] = useState<Comment[]>([]);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const [commentsOpen, setCommentsOpen] = useState<boolean>(false);

  const getPostComments = async (): Promise<void> => {
    setCommentsLoading(true);
    try {
      const comments = await getPublications(
        {
          where: {
            commentOn: {
              id: commentId !== "" ? commentId : mainVideo.id,
              ranking: {
                filter: CommentRankingFilterType.Relevant,
              },
            },
          },
          limit: LimitType.TwentyFive,
        },
        profile?.id
      );

      if (!comments || !comments?.data || !comments?.data?.publications) {
        setCommentsLoading(false);
        return;
      }
      const sortedArr: Comment[] = [
        ...comments?.data?.publications?.items,
      ] as Comment[];
      if (sortedArr?.length < 25) {
        setHasMoreComments(false);
      } else {
        setHasMoreComments(true);
      }
      setCommentors(sortedArr);
      setPaginated(comments?.data?.publications?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
    setCommentsLoading(false);
  };

  const getMorePostComments = async (): Promise<void> => {
    try {
      if (!paginated?.next) {
        // fix apollo duplications on null next
        setHasMoreComments(false);
        return;
      }

      const comments = await getPublications(
        {
          where: {
            commentOn: {
              id: commentId !== "" ? commentId : mainVideo.id,
              ranking: {
                filter: CommentRankingFilterType.Relevant,
              },
            },
          },
          limit: LimitType.TwentyFive,
          cursor: paginated?.next,
        },
        profile?.id
      );

      if (
        !comments ||
        !comments?.data ||
        !comments?.data?.publications ||
        comments?.data?.publications?.items?.length < 1
      ) {
        setHasMoreComments(false);
        setCommentsLoading(false);
        return;
      }
      const sortedArr: Comment[] = [
        ...comments?.data?.publications?.items,
      ] as Comment[];
      if (sortedArr?.length < 25) {
        setHasMoreComments(false);
      }
      setCommentors([...commentors, ...sortedArr]);
      setPaginated(comments?.data?.publications?.pageInfo);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (mainVideo.id) {
      getPostComments();
    }
  }, [mainVideo.id, profile?.id, commentId]);
  useEffect(() => {
    if (index.message === "Successfully Indexed") {
      getPostComments();
    }
  }, [index.message]);

  return {
    commentors,
    getMorePostComments,
    commentsLoading,
    hasMoreComments,
    commentsOpen,
    setCommentsOpen,
  };
};

export default useInteractionsPlayer;

import pollResult from "@/app/lib/helpers/pollResult";
import { ModalContext } from "@/app/providers";
import {
  Account,
  AccountPostReaction,
  PageSize,
  Post,
  PostReactionType,
  PostReferenceType,
} from "@lens-protocol/client";
import {
  fetchFollowers,
  fetchFollowing,
  fetchPostReactions,
  fetchPostReferences,
  addReaction,
  repost,
  executePostAction,
  fetchWhoExecutedActionOnPost,
} from "@lens-protocol/client/actions";
import { useContext, useEffect, useState } from "react";
import { Indexar } from "../../Common/types/common.types";

const useWho = (dict: any) => {
  const context = useContext(ModalContext);
  const [openMirrorChoice, setOpenMirrorChoice] = useState<boolean[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [reactors, setReactors] = useState<Account[]>([]);
  const [quoters, setQuoters] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hasMoreQuote, setHasMoreQuote] = useState<boolean>(true);
  const [pageInfo, setPageInfo] = useState<string>();
  const [pageInfoQuote, setPageInfoQuote] = useState<string>();
  const [mirrorQuote, setMirrorQuote] = useState<boolean>(false);
  const [interactionsLoading, setInteractionsLoading] = useState<
    {
      mirror: boolean;
      like: boolean;
      collect: boolean;
    }[]
  >([]);

  const showLikes = async () => {
    if (!context?.reactBox?.id) return;
    setDataLoading(true);
    try {
      const data = await fetchPostReactions(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          post: context?.reactBox?.id,
          pageSize: PageSize.Ten,
          filter: {
            anyOf: [PostReactionType.Upvote],
          },
        }
      );

      if (!data?.isOk()) {
        setDataLoading(false);
        return;
      }

      setReactors(
        (data?.value?.items?.map((item) => item?.account) as Account[]) || []
      );
      setPageInfo(data?.value?.pageInfo?.next!);

      if (!data?.value?.items || data?.value?.items?.length < 10) {
        setHasMore(false);
        setDataLoading(false);
        return;
      } else if (data?.value?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showMirrorQuotes = async () => {
    if (!context?.reactBox?.id) return;

    setDataLoading(true);

    try {
      const mirrorData = await fetchPostReferences(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          referencedPost: context?.reactBox?.id,
          referenceTypes: [PostReferenceType.RepostOf],
        }
      );

      if (!mirrorData?.isOk()) {
        setDataLoading(false);
        return;
      }

      setReactors(
        (mirrorData?.value?.items?.map((item) => item?.author) || []) as any[]
      );
      setPageInfo(mirrorData?.value?.pageInfo?.next!);
      if (!mirrorData?.value?.items || mirrorData?.value?.items?.length < 10) {
        setHasMore(false);
      } else if (mirrorData?.value?.items?.length === 10) {
        setHasMore(true);
      }

      const quoteData = await fetchPostReferences(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          referencedPost: context?.reactBox?.id,
          referenceTypes: [PostReferenceType.QuoteOf],
        }
      );

      if (!quoteData?.isOk()) {
        setDataLoading(false);
        return;
      }

      setQuoters((quoteData?.value?.items || []) as Post[]);
      setPageInfoQuote(quoteData?.value.pageInfo?.next!);

      if (!quoteData?.value?.items || quoteData?.value?.items?.length < 10) {
        setHasMoreQuote(false);
        setDataLoading(false);
      } else if (quoteData?.value?.items?.length === 10) {
        setHasMoreQuote(true);
      }

      if (
        (mirrorData?.value?.items || [])?.length < 1 &&
        (quoteData?.value?.items || [])?.length > 0
      ) {
        setMirrorQuote(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showActors = async () => {
    if (!context?.reactBox?.id) return;
    setDataLoading(true);
    try {
      const data = await fetchWhoExecutedActionOnPost(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          post: context?.reactBox?.id,
        }
      );

      if (!data?.isOk()) {
        setDataLoading(false);
        return;
      }

      setReactors(
        (data?.value?.items?.map((item) => item?.account) || []) as any
      );
      setPageInfo(data?.value.pageInfo?.next!);

      if (!data?.value?.items || data?.value?.items?.length < 10) {
        setHasMore(false);
        setDataLoading(false);
      } else if (data?.value?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showFollowing = async () => {
    if (!context?.reactBox?.id) return;
    setDataLoading(true);
    try {
      const data = await fetchFollowing(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          account: context?.reactBox?.id,
        }
      );

      if (!data.isOk()) {
        setDataLoading(false);
        return;
      }

      setReactors(data?.value?.items as any[]);
      setPageInfo(data?.value.pageInfo?.next!);

      if (!data?.value?.items || data?.value?.items?.length < 10) {
        setHasMore(false);
        setDataLoading(false);
      } else if (data?.value?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showFollowers = async () => {
    if (!context?.reactBox?.id) return;
    setDataLoading(true);
    try {
      const data = await fetchFollowers(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          account: context?.reactBox?.id,
        }
      );

      if (!data.isOk()) {
        setDataLoading(false);
        return;
      }
      setReactors((data?.value?.items || []) as any[]);
      setPageInfo(data?.value.pageInfo?.next!);

      if (!data?.value?.items || data?.value?.items?.length < 10) {
        setHasMore(false);
        setDataLoading(false);
        return;
      } else if (data?.value?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showMoreLikes = async () => {
    if (!pageInfo || !hasMore) return;
    try {
      const data = await fetchPostReactions(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          cursor: pageInfo,
          post: context?.reactBox?.id,
          pageSize: PageSize.Ten,
          filter: {
            anyOf: [PostReactionType.Upvote],
          },
        }
      );

      if (!data?.isOk()) {
        setDataLoading(false);
        return;
      }
      setReactors([
        ...reactors,
        ...((data?.value?.items?.map((item) => item?.account) as Account[]) ||
          [] ||
          []),
      ]);
      setPageInfo(data?.value.pageInfo?.next!);

      if (!data?.value?.items || data?.value?.items?.length < 10) {
        setHasMore(false);
        return;
      } else if (data?.value?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMoreActors = async () => {
    if (!pageInfo || !hasMore) return;

    try {
      const data = await fetchWhoExecutedActionOnPost(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          post: context?.reactBox?.id,
          cursor: pageInfo,
        }
      );

      if (!data.isOk()) {
        return;
      }

      setReactors([
        ...reactors,
        ...((data?.value?.items?.map((item) => item?.account) as Account[]) ||
          [] ||
          []),
      ]);
      setPageInfo(data?.value?.pageInfo?.next!);

      if (!data?.value?.items || data?.value?.items?.length < 10) {
        setHasMore(false);
        return;
      } else if (data?.value?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMoreFollowing = async () => {
    if (!pageInfo || !hasMore) return;
    try {
      const data = await fetchFollowing(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          cursor: pageInfo,
          pageSize: PageSize.Ten,
          account: context?.reactBox?.id,
        }
      );

      if (!data.isOk()) {
        setDataLoading(false);
        return;
      }

      setReactors([...reactors, ...((data?.value?.items as any[]) || [])]);
      setPageInfo(data?.value.pageInfo?.next!);

      if (!data?.value?.items || data?.value?.items?.length < 10) {
        setHasMore(false);
        return;
      } else if (data?.value?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMoreFollowers = async () => {
    if (!pageInfo || !hasMore) return;
    try {
      const data = await fetchFollowers(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          cursor: pageInfo,
          pageSize: PageSize.Ten,
          account: context?.reactBox?.id,
        }
      );

      if (!data.isOk()) {
        setDataLoading(false);
        return;
      }

      setReactors([...reactors, ...((data?.value?.items as any[]) || [])]);
      setPageInfo(data?.value.pageInfo?.next!);

      if (!data?.value?.items || data?.value?.items?.length < 10) {
        setHasMore(false);
        return;
      } else if (data?.value?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMoreComments = async () => {
    if ((!pageInfo || !hasMore) && (!pageInfoQuote || !hasMoreQuote)) return;

    try {
      if (hasMore && pageInfo) {
        const commentData = await fetchPostReferences(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            cursor: pageInfo,
            pageSize: PageSize.Ten,
            referencedPost: context?.reactBox?.id,
            referenceTypes: [PostReferenceType.CommentOn],
          }
        );

        if (!commentData.isOk()) {
          return;
        }
        setQuoters([
          ...quoters,
          ...((commentData?.value?.items || []) as Post[]),
        ]);
        setPageInfo(commentData?.value.pageInfo?.next!);
        setOpenMirrorChoice([
          ...openMirrorChoice,
          ...Array.from(
            { length: commentData?.value?.items?.length || 0 },
            () => false
          ),
        ]);
        setInteractionsLoading([
          ...interactionsLoading,
          ...Array.from(
            { length: commentData?.value?.items?.length || 0 },
            () => ({
              mirror: false,
              like: false,
              collect: false,
            })
          ),
        ]);
        if (
          !commentData?.value?.items ||
          commentData?.value?.items?.length < 10
        ) {
          setHasMore(false);
          return;
        } else if (commentData?.value?.items?.length === 10) {
          setHasMore(true);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMoreQuoteMirrors = async () => {
    if ((!pageInfo || !hasMore) && (!pageInfoQuote || !hasMoreQuote)) return;

    try {
      if (hasMore && pageInfo) {
        const mirrorData = await fetchPostReferences(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            cursor: pageInfo,
            pageSize: PageSize.Ten,
            referencedPost: context?.reactBox?.id,
            referenceTypes: [PostReferenceType.RepostOf],
          }
        );

        if (!mirrorData.isOk()) {
          return;
        }

        setReactors([
          ...reactors,
          ...(mirrorData?.value?.items?.map((item) => item?.author) || []),
        ]);
        setPageInfo(mirrorData?.value.pageInfo?.next!);

        if (
          !mirrorData?.value?.items ||
          mirrorData?.value?.items?.length < 10
        ) {
          setHasMore(false);
          return;
        } else if (mirrorData?.value?.items?.length === 10) {
          setHasMore(true);
        }
      }

      if (pageInfoQuote && hasMoreQuote) {
        const quoteData = await fetchPostReferences(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            cursor: pageInfo,
            pageSize: PageSize.Ten,
            referencedPost: context?.reactBox?.id,
            referenceTypes: [PostReferenceType.QuoteOf],
          }
        );

        if (!quoteData.isOk()) {
          return;
        }

        setQuoters([
          ...quoters,
          ...((quoteData?.value?.items || []) as Post[]),
        ]);
        setPageInfoQuote(quoteData?.value.pageInfo?.next!);

        if (!quoteData?.value?.items || quoteData?.value?.items?.length < 10) {
          setHasMoreQuote(false);
          return;
        } else if (quoteData?.value?.items?.length === 10) {
          setHasMoreQuote(true);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showComments = async () => {
    if (!context?.reactBox?.id) return;

    setDataLoading(true);

    try {
      const commentData = await fetchPostReferences(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          referencedPost: context?.reactBox.id,
          referenceTypes: [PostReferenceType.CommentOn],
        }
      );

      if (!commentData?.isOk()) {
        setDataLoading(false);
        return;
      }

      setQuoters((commentData?.value?.items || []) as Post[]);
      setOpenMirrorChoice(
        Array.from(
          { length: commentData?.value?.items?.length || 0 },
          () => false
        )
      );
      setInteractionsLoading(
        Array.from({ length: commentData?.value?.items?.length || 0 }, () => ({
          mirror: false,
          like: false,
          collect: false,
        }))
      );
      setPageInfo(commentData?.value.pageInfo?.next!);
      if (
        !commentData?.value?.items ||
        commentData?.value?.items?.length < 10
      ) {
        setHasMore(false);
      } else if (commentData?.value?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showMore = () => {
    switch (context?.reactBox?.type) {
      case "Likes":
        showMoreLikes();
        break;

      case "Acts":
        showMoreActors();
        break;

      case "Mirrors":
        showMoreQuoteMirrors();
        break;

      case "Followers":
        showMoreFollowers();
        break;

      case "Following":
        showMoreFollowing();
        break;

      case "Comments":
        showMoreComments();
        break;
    }
  };

  const like = async (id: string, hasReacted: boolean) => {
    if (!context?.lensConectado?.profile) return;

    const index = quoters?.findIndex((item) => item?.id == id);
    if (index == -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        like: true,
      };
      return arr;
    });

    try {
      await addReaction(context?.lensConectado?.sessionClient!, {
        post: id,
        reaction: hasReacted ? "DOWNVOTE" : "UPVOTE",
      });

      setQuoters?.((prev) => {
        let arr = [...prev];
        arr[index] = {
          ...arr[index],
          operations: {
            ...arr[index].operations!,
            hasUpvoted: hasReacted ? false : true,
          },
          stats: {
            ...arr[index].stats,
            upvotes: hasReacted
              ? Number(arr[index]?.stats?.upvotes) - 1
              : Number(arr[index]?.stats?.upvotes) + 1,
          },
        };

        return arr;
      });
    } catch (err: any) {
      context?.setModalOpen(dict?.Common?.error);
    }

    setInteractionsLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        like: false,
      };
      return arr;
    });
  };

  const simpleCollect = async (id: string) => {
    if (!context?.lensConectado?.profile) return;

    const index = quoters?.findIndex((item) => item?.id == id);
    if (index == -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        collect: true,
      };
      return arr;
    });

    try {
      const data = await executePostAction(
        context?.lensConectado?.sessionClient!,
        {
          post: id,
          action: {
            simpleCollect: {
              selected: true,
            },
          },
        }
      );

      if (data.isOk()) {
        if ((data.value as any)?.reason?.includes("Signless")) {
          context?.setSignless?.(true);
        } else if ((data.value as any)?.hash) {
          context?.setIndexar(Indexar.Indexando);
          if (
            await pollResult(
              (data.value as any)?.hash,
              context?.lensConectado?.sessionClient!
            )
          ) {
            context?.setIndexar(Indexar.Exito);

            setTimeout(() => {
              context?.setIndexar(Indexar.Inactivo);
            }, 3000);
          } else {
            context?.setModalOpen(dict?.Common?.error);
          }
        }
      }

      setQuoters?.((prev) => {
        let arr = [...prev];
        arr[index] = {
          ...arr[index],
          operations: {
            ...arr[index].operations!,
            hasSimpleCollected: true,
          },
          stats: {
            ...arr[index].stats,
            collects: Number(arr[index]?.stats?.collects) + 1,
          },
        };

        return arr;
      });
    } catch (err: any) {
      context?.setModalOpen(dict?.Common?.error);
    }

    setInteractionsLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        collect: false,
      };
      return arr;
    });
  };

  const mirror = async (id: string) => {
    if (!context?.lensConectado?.profile) return;

    const index = quoters?.findIndex((item) => item?.id == id);
    if (index == -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        mirror: true,
      };
      return arr;
    });

    try {
      const data = await repost(context?.lensConectado?.sessionClient!, {
        post: id,
      });
      if (data.isOk()) {
        if ((data.value as any)?.reason?.includes("Signless")) {
          context?.setSignless?.(true);
        } else if ((data.value as any)?.hash) {
          context?.setIndexar(Indexar.Indexando);
          if (
            await pollResult(
              (data.value as any)?.hash,
              context?.lensConectado?.sessionClient!
            )
          ) {
            context?.setIndexar(Indexar.Exito);

            setQuoters?.((prev) => {
              let arr = [...prev];
              arr[index] = {
                ...arr[index],
                operations: {
                  ...arr[index].operations!,
                  hasReposted: {
                    ...arr[index].operations?.hasReposted!,
                    optimistic: true,
                  },
                },
                stats: {
                  ...arr[index].stats,
                  reposts: Number(arr[index]?.stats?.reposts) + 1,
                },
              };

              return arr;
            });
            setTimeout(() => {
              context?.setIndexar(Indexar.Inactivo);
            }, 3000);
          } else {
            context?.setModalOpen(dict?.Common?.error);
          }
        }
      }
    } catch (err: any) {
      context?.setModalOpen(dict?.Common?.error);
    }

    setInteractionsLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        mirror: false,
      };
      return arr;
    });
  };

  useEffect(() => {
    if (context?.reactBox) {
      switch (context?.reactBox?.type) {
        case "Likes":
          reactors?.length < 1 && showLikes();
          break;

        case "Acts":
          reactors?.length < 1 && showActors();
          break;

        case "Mirrors":
          quoters?.length < 1 && reactors?.length < 1 && showMirrorQuotes();
          break;

        case "Followers":
          reactors?.length < 1 && showFollowers();
          break;

        case "Following":
          reactors?.length < 1 && showFollowing();
          break;

        case "Comments":
          reactors?.length < 1 && showComments();
          break;
      }
    } else {
      setPageInfo(undefined);
      setPageInfoQuote(undefined);
      setReactors([]);
      setQuoters([]);
      setHasMore(true);
      setHasMoreQuote(true);
    }
  }, [context?.reactBox]);

  return {
    dataLoading,
    reactors,
    quoters,
    hasMore,
    hasMoreQuote,
    showMore,
    mirrorQuote,
    setMirrorQuote,
    like,
    mirror,
    openMirrorChoice,
    setOpenMirrorChoice,
    simpleCollect,
    interactionsLoading,
  };
};

export default useWho;

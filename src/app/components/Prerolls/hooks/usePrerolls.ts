import { ModalContext } from "@/app/providers";
import { useContext, useEffect, useState } from "react";
import { getAllPrerolls } from "../../../../../graphql/queries/getPrerolls";
import { Post } from "@lens-protocol/client";
import { fetchPost } from "@lens-protocol/client/actions";

const usePrerolls = () => {
  const context = useContext(ModalContext);
  const [imagesLoadingLeft, setImagesLoadingLeft] = useState<boolean[]>([]);
  const [imagesLoadingRight, setImagesLoadingRight] = useState<boolean[]>([]);

  const getPrerolls = async () => {
    context?.setPrerollsLoading(true);
    try {
      const data = await getAllPrerolls();

      const colls = await Promise.all(
        data?.data?.collectionCreateds?.map(
          async (coll: any, index: number) => {
            let publication;
            if (coll?.postId) {
              const post = await fetchPost(
                context?.lensConectado?.sessionClient ?? context?.clienteLens!,
                {
                  post: coll?.postId,
                }
              );

              if (post.isOk()) {
                publication = post?.value as Post;
              }
            }
            return {
              ...coll,
              profile: publication?.author,
              publication,
              metadata: {
                ...coll?.metadata,
                sizes:
                  typeof coll?.metadata?.sizes === "string"
                    ? (coll?.metadata?.sizes as any)
                        ?.split(",")
                        ?.map((word: string) => word.trim())
                        ?.filter((word: string) => word.length > 0)
                    : coll?.metadata?.sizes,
                colors:
                  typeof coll?.metadata?.colors === "string"
                    ? (coll?.metadata?.colors as any)
                        ?.split(",")
                        ?.map((word: string) => word.trim())
                        ?.filter((word: string) => word.length > 0)
                    : coll?.metadata?.colors,
                mediaTypes:
                  typeof coll?.metadata?.mediaTypes === "string"
                    ? (coll?.metadata?.mediaTypes as any)
                        ?.split(",")
                        ?.map((word: string) => word.trim())
                        ?.filter((word: string) => word.length > 0)
                    : coll?.metadata?.mediaTypes,
                access:
                  typeof coll?.metadata?.access === "string"
                    ? (coll?.metadata?.access as any)
                        ?.split(",")
                        ?.map((word: string) => word.trim())
                        ?.filter((word: string) => word.length > 0)
                    : coll?.metadata?.access,

                tags:
                  typeof coll?.metadata?.tags === "string"
                    ? (coll?.metadata?.tags as any)
                        ?.split(",")
                        ?.map((word: string) => word.trim())
                        ?.filter((word: string) => word.length > 0)
                    : coll?.metadata?.tags,
              },
              price: Number(coll?.price) / 10 ** 18,
              newDrop: index < 28 ? true : false,
              currentIndex: 0,
              chosenSize:
                typeof coll?.metadata?.sizes === "string"
                  ? (coll?.metadata?.sizes as any)
                      ?.split(",")
                      ?.map((word: string) => word.trim())
                      ?.filter((word: string) => word.length > 0)?.[0]
                  : coll?.metadata?.sizes?.[0],
              chosenColor:
                typeof coll?.metadata?.colors === "string"
                  ? (coll?.metadata?.colors as any)
                      ?.split(",")
                      ?.map((word: string) => word.trim())
                      ?.filter((word: string) => word.length > 0)?.[0]
                  : coll?.metadata?.colors?.[0],
              bgColor:
                coll.printType === "3"
                  ? "#32C5FF"
                  : coll.printType === "2"
                  ? "#6236FF"
                  : coll.printType === "1"
                  ? "#FFC800"
                  : coll.printType === "4"
                  ? "#29C28A"
                  : "#B620E0",
            };
          }
        )
      );

      const sorted = colls?.sort(() => Math.random() - 0.5);
      context?.setPrerolls({
        left: sorted?.slice(0, Math.ceil(sorted.length / 2)),
        right: sorted?.slice(Math.ceil(sorted.length / 2)),
      });
    } catch (err: any) {
      console.error(err.message);
    }
    context?.setPrerollsLoading(false);
  };

  useEffect(() => {
    if (
      Number(context?.prerolls.left?.length) < 1 &&
      Number(context?.prerolls.right?.length) < 1 &&
      context?.clienteLens
    ) {
      getPrerolls();
    }
  }, [context?.clienteLens]);

  useEffect(() => {
    if (
      Number(context?.prerolls.left?.length) > 0 &&
      Number(context?.prerolls.right?.length) > 0
    ) {
      setImagesLoadingLeft(
        Array.from(
          { length: Number(context?.prerolls.left?.length) },
          () => false
        )
      );
      setImagesLoadingRight(
        Array.from(
          { length: Number(context?.prerolls.right?.length) },
          () => false
        )
      );
    }
  }, [context?.prerolls]);

  return {
    imagesLoadingLeft,
    imagesLoadingRight,
    setImagesLoadingLeft,
    setImagesLoadingRight,
  };
};

export default usePrerolls;

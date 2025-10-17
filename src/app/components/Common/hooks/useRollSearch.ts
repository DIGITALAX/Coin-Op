import { useContext, useEffect, useState } from "react";
import { getPrerollSearch } from "../../../../../graphql/queries/getPrerolls";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { CartItem, Preroll } from "../../Prerolls/types/prerolls.types";
import { ModalContext, ScrollContext, SynthContext } from "@/app/providers";
import buildTextQuery from "@/app/lib/helpers/buildTextQuery";
import { fetchPost } from "@lens-protocol/client/actions";
import { Post } from "@lens-protocol/client";

const useRollSearch = (dict: any) => {
  const context = useContext(ModalContext);
  const scrollContext = useContext(ScrollContext);
  const synthContext = useContext(SynthContext);
  const [prompt, setPrompt] = useState<string>("");
  const [cartAnim, setCartAnim] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const handleRollSearch = async () => {
    if (!prompt || prompt.trim() == "") return;
    setSearchLoading(true);
    try {
      const searchItems = await getPrerollSearch(buildTextQuery(prompt!)!);

      // const colls = await handleCollectionProfilesAndPublications(
      //   searchItems?.data?.collectionCreateds,
      //   lensConnected
      // );

      const colls = await Promise.all(
        searchItems?.data?.collectionCreateds?.map(
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

      synthContext?.setRollSearch(colls);
    } catch (err: any) {
      console.error(err.message);
    }
    setSearchLoading(false);
  };

  const handlePromptChoose = async (preroll: Preroll) => {
    const response = await fetch(
      `${INFURA_GATEWAY}/ipfs/${
        preroll.metadata?.images?.[0].split("ipfs://")[1]
      }`
    );
    const data = await response.blob();
    const image = new File([data], "coinop", { type: "image/png" });

    synthContext?.setSynthConfig({
      type: "img2img",
      prompt: preroll?.metadata?.prompt || "",
      image,
    });

    if (!scrollContext?.synthRef || !scrollContext?.synthRef?.current) return;

    scrollContext?.synthRef?.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      scrollContext.synthRef.current!.scrollTop =
        scrollContext?.synthRef.current!.scrollHeight;
    }, 500);
  };

  const handleAddToCart = (preroll: Preroll) => {
    const existing = [...(context?.cartItems || [])].findIndex(
      (item) =>
        item.item?.collectionId === preroll.collectionId &&
        item.chosenSize === preroll.chosenSize &&
        item.chosenColor === preroll.chosenColor
    );

    let newCartItems: CartItem[] = [...(context?.cartItems || [])];

    if (
      Number(
        context?.cartItems
          ?.filter(
            (item) =>
              item?.item?.postId == newCartItems?.[existing]?.item?.postId
          )
          ?.reduce(
            (accumulator, currentItem) =>
              accumulator + currentItem.chosenAmount,
            0
          )
      ) +
        1 >
        Number(newCartItems?.[existing]?.item?.amount) ||
      Number(newCartItems?.[existing]?.item?.amount) ==
        Number(newCartItems?.[existing]?.item?.tokenIdsMinted?.length)
    ) {
      context?.setModalOpen(dict?.Common?.eager);

      return;
    }

    if (existing !== -1) {
      newCartItems = [
        ...newCartItems.slice(0, existing),
        {
          ...newCartItems[existing],
          chosenAmount: newCartItems[existing].chosenAmount + 1,
        },
        ...newCartItems.slice(existing + 1),
      ];
    } else {
      newCartItems.push({
        item: preroll,
        chosenColor: preroll?.chosenColor,
        chosenSize: preroll?.chosenSize,
        chosenAmount: 1,
        chosenIndex:
          preroll?.printType !== "0" && preroll?.printType !== "1"
            ? 0
            : preroll?.metadata?.sizes?.indexOf(preroll?.chosenSize),
      });
    }

    context?.setCartItems(newCartItems);
    context?.setCartAddAnim(preroll?.metadata?.images[0]);
  };

  return {
    handleRollSearch,
    prompt,
    setPrompt,
    handlePromptChoose,
    handleAddToCart,
    searchLoading,
    cartAnim,
  };
};

export default useRollSearch;

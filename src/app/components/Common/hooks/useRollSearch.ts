import { useContext, useEffect, useState } from "react";
import { getPrerollSearch } from "../../../../../graphql/queries/getPrerolls";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { CartItem, Preroll } from "../../Prerolls/types/prerolls.types";
import { ModalContext, ScrollContext, SynthContext } from "@/app/providers";
import buildTextQuery from "@/app/lib/helpers/buildTextQuery";

const useRollSearch = (dict: any) => {
  const context = useContext(ModalContext);
  const scrollContext = useContext(ScrollContext);
  const synthContext = useContext(SynthContext);
  const [prompt, setPrompt] = useState<string>("");
  const [cartAnim, setCartAnim] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const handleRollSearch = async () => {
    setSearchLoading(true);
    try {
      const searchItems = await getPrerollSearch(buildTextQuery(prompt!)!);

      // const colls = await handleCollectionProfilesAndPublications(
      //   searchItems?.data?.collectionCreateds,
      //   lensConnected
      // );

      synthContext?.setRollSearch(
        searchItems?.data?.collectionCreateds as Preroll[]
      );
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

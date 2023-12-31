import { CartItem, Preroll } from "@/components/Common/types/common.types";
import { useContext, useEffect, useState } from "react";
import { setRollSearch } from "../../../../redux/reducers/rollSearchSlice";
import { ScrollContext } from "@/pages/_app";
import { setSynthConfig } from "../../../../redux/reducers/synthConfigSlice";
import { setCart } from "../../../../redux/reducers/cartSlice";
import { setWalletConnected } from "../../../../redux/reducers/walletConnectedSlice";
import { Chain } from "wagmi";
import { setChain } from "../../../../redux/reducers/chainSlice";
import { AnyAction, Dispatch } from "redux";
import { setModalOpen } from "../../../../redux/reducers/modalOpenSlice";
import { setCartAddAnim } from "../../../../redux/reducers/cartAddAnimSlice";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { getPrerollSearch } from "../../../../graphql/subgraph/queries/getPrerolls";
import handleCollectionProfilesAndPublications from "../../../../lib/subgraph/helpers/handleCollectionProfilesAndPublications";
import { Profile } from "@/components/Common/types/generated";
import buildTextQuery from "../../../../lib/lens/helpers/buildTextQuery";

const useRollSearch = (
  dispatch: Dispatch<AnyAction>,
  isConnected: boolean,
  address: `0x${string}` | undefined,
  chainNetwork:
    | (Chain & {
        unsupported?: boolean | undefined;
      })
    | undefined,
  cartItems: CartItem[],
  lensConnected: Profile | undefined
) => {
  const { scrollRef, synthRef } = useContext(ScrollContext);
  const [prompt, setPrompt] = useState<string>("");
  const [cartAnim, setCartAnim] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const handleRollSearch = async () => {
    setSearchLoading(true)
    try {
      const searchItems = await getPrerollSearch(buildTextQuery(prompt!)!);

      const colls = await handleCollectionProfilesAndPublications(
        searchItems?.data?.collectionCreateds,
        lensConnected
      );

      dispatch(setRollSearch(colls as Preroll[]));
    } catch (err: any) {
      console.error(err.message);
    }
    setSearchLoading(false)
  };

  const handlePromptChoose = async (preroll: Preroll) => {
    const response = await fetch(
      `${INFURA_GATEWAY}/ipfs/${
        preroll.collectionMetadata?.images?.[0].split("ipfs://")[1]
      }`
    );
    const data = await response.blob();
    const image = new File([data], "coinop", { type: "image/png" });

    dispatch(
      setSynthConfig({
        actionType: "img2img",
        actionPrompt: preroll?.collectionMetadata?.prompt || "",
        actionImage: image,
      })
    );

    if (!synthRef || !synthRef?.current) return;

    synthRef?.current.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => {
      synthRef.current!.scrollTop = synthRef.current!.scrollHeight;
    }, 500);
  };

  const handleAddToCart = (preroll: Preroll) => {
    const existing = [...cartItems].findIndex(
      (item) =>
        item.item?.collectionId === preroll.collectionId &&
        item.chosenSize === preroll.chosenSize &&
        item.chosenColor === preroll.chosenColor
    );

    let newCartItems: CartItem[] = [...cartItems];

    if (
      cartItems
        ?.filter(
          (item) => item?.item?.pubId == newCartItems?.[existing]?.item?.pubId
        )
        ?.reduce(
          (accumulator, currentItem) => accumulator + currentItem.chosenAmount,
          0
        ) +
        1 >
        Number(newCartItems?.[existing]?.item?.amount) ||
      Number(newCartItems?.[existing]?.item?.amount) ==
        Number(newCartItems?.[existing]?.item?.soldTokens)
    ) {
      dispatch(
        setModalOpen({
          actionOpen: true,
          actionMessage:
            "We know you're eager, but you've reached this prints' collect limit!",
        })
      );
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
            : preroll?.collectionMetadata?.sizes?.indexOf(preroll?.chosenSize),
      });
    }

    dispatch(setCart(newCartItems));
    setCartAnim(true);
    dispatch(setCartAddAnim(preroll?.collectionMetadata?.images[0]));
  };

  const scrollToCheckOut = () => {
    if (!scrollRef || !scrollRef?.current) return;

    scrollRef?.current.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => {
      scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
    }, 500);
  };

  useEffect(() => {
    if (cartAnim) {
      setTimeout(() => {
        setCartAnim(false);
      }, 2000);
    }
  }, [cartAnim]);

  useEffect(() => {
    dispatch(setWalletConnected(isConnected));
    dispatch(setChain(chainNetwork?.id));
  }, [address, isConnected, chainNetwork]);

  return {
    handleRollSearch,
    prompt,
    setPrompt,
    handlePromptChoose,
    scrollToCheckOut,
    handleAddToCart,
    cartAnim,
    searchLoading
  };
};

export default useRollSearch;

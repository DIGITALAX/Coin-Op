import { CartItem, PreRoll } from "@/components/Common/types/common.types";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { setRollSearch } from "../../../../redux/reducers/rollSearchSlice";
import { initializeAlgolia } from "../../../../lib/algolia/client";
import { setAlgolia } from "../../../../redux/reducers/algoliaSlice";
import { ScrollContext } from "@/pages/_app";
import { setSynthConfig } from "../../../../redux/reducers/synthConfigSlice";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { setCart } from "../../../../redux/reducers/cartSlice";
import { setWalletConnected } from "../../../../redux/reducers/walletConnectedSlice";
import { useAccount, useNetwork } from "wagmi";
import { setChain } from "../../../../redux/reducers/chainSlice";
import { setCurrentPKP } from "../../../../redux/reducers/currentPKPSlice";
import { getLitLoginLocalStorage } from "../../../../lib/subgraph/utils";

const useRollSearch = () => {
  const { scrollRef, synthRef } = useContext(ScrollContext);
  const { isConnected, address } = useAccount();
  const { chain: chainNetwork } = useNetwork();
  const dispatch = useDispatch();
  const [prompt, setPrompt] = useState<string>("");
  const [cartAnim, setCartAnim] = useState<boolean>(false);
  const algolia = useSelector(
    (state: RootState) => state.app.algoliaReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );

  const handleRollSearch = async () => {
    try {
      if (!algolia) return;

      const { hits } = await algolia.search(prompt);

      dispatch(setRollSearch(hits.length > 0 ? hits : (undefined as any)));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handlePromptChoose = async (preRoll: PreRoll) => {
    const response = await fetch(
      `${INFURA_GATEWAY}/ipfs/${preRoll.uri?.image?.[0].split("ipfs://")[1]}`
    );
    const data = await response.blob();
    const image = new File([data], "coinop", { type: "image/png" });

    dispatch(
      setSynthConfig({
        actionType: "img2img",
        actionPrompt: preRoll.uri.prompt,
        actionImage: image,
      })
    );

    if (!synthRef || !synthRef?.current) return;

    synthRef?.current.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => {
      synthRef.current!.scrollTop = synthRef.current!.scrollHeight;
    }, 500);
  };

  const handleSearchSimilar = async (preRoll: PreRoll) => {
    try {
      if (!algolia) return;
      const tagFilters = preRoll.uri.tags
        .map((tag) => `tags:${tag}`)
        .join(" OR ");

      const { hits } = await algolia.search("", {
        filters: tagFilters,
      });

      dispatch(setRollSearch(hits.length > 0 ? hits : (undefined as any)));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleAddToCart = (preRoll: PreRoll) => {
    let { colors, bgColor, ...newObj } = preRoll;
    const existing = [...cartItems].findIndex(
      (item) =>
        item.collectionId === newObj.collectionId &&
        item.chosenSize === newObj.chosenSize &&
        item.chosenColor === newObj.chosenColor
    );

    let newCartItems: CartItem[] = [...cartItems];

    if (existing !== -1) {
      newCartItems = [
        ...newCartItems.slice(0, existing),
        {
          ...newCartItems[existing],
          amount: newCartItems[existing].amount + 1,
        },
        ...newCartItems.slice(existing + 1),
      ];
    } else {
      newCartItems.push({
        ...newObj,
        amount: 1,
        uri: {
          ...preRoll.uri,
          image: preRoll?.uri?.image?.[0],
        },
        price:
          preRoll?.printType === "shirt" || preRoll?.printType === "hoodie"
            ? preRoll.price?.[0]
            : preRoll.price?.[preRoll.sizes?.indexOf(preRoll.chosenSize)],
      });
    }

    dispatch(setCart(newCartItems));
    setCartAnim(true);
  };

  const scrollToCheckOut = () => {
    if (!scrollRef || !scrollRef?.current) return;

    scrollRef?.current.scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => {
      scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
    }, 500);
  };

  const checkIfLoggedIn = async () => {
    try {
      const data = getLitLoginLocalStorage();

      if (data) {
        const matchTimeIssued = data?.authSig?.signedMessage.match(
          /Issued At: ([\d\-T:.]+)Z/
        )?.[1];

        if (matchTimeIssued) {
          const expirationTime = new Date(
            new Date(matchTimeIssued).getTime() + 23 * 60 * 60 * 1000
          );
          const thirtyMinsAgo = new Date(new Date().getTime() - 30 * 60 * 1000);

          if (expirationTime >= thirtyMinsAgo) {
            dispatch(
              setCurrentPKP({
                ...data,
                tokenId: data?.tokenId,
                sessionSig: data?.sessionSig,
                pkpWallet: data?.pkpWallet,
                authSig: data?.authSig,
                encryptedToken: data?.encryptedToken,
              })
            );
          }
        }
      }
    } catch (err: any) {}
  };

  useEffect(() => {
    if (!algolia) {
      const index = initializeAlgolia();
      dispatch(setAlgolia(index));
    }
  }, []);

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

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  return {
    handleRollSearch,
    prompt,
    setPrompt,
    handlePromptChoose,
    scrollToCheckOut,
    handleSearchSimilar,
    handleAddToCart,
    cartAnim,
  };
};

export default useRollSearch;

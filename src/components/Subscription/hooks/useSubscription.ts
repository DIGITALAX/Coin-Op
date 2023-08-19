import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessagesModal } from "../../../../redux/reducers/messagesModalSlice";
import { RootState } from "../../../../redux/store";
import { setModalOpen } from "../../../../redux/reducers/modalOpenSlice";
import { setSubscriptionInfo } from "../../../../redux/reducers/subscriptionInfoSlice";
import { useRouter } from "next/router";
import { COIN_OP_SUBSCRIPTION } from "../../../../lib/constants";
import { ethers } from "ethers";
import CoinOpSubscriptionABI from "../../../../abis/CoinOpSubscription.json";
import { createTxData } from "../../../../lib/subgraph/helpers/createTxData";
import { litExecute } from "../../../../lib/subgraph/helpers/litExecute";
import { chunkString } from "../../../../lib/subgraph/helpers/chunkString";

const useSubscription = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [subscriptionAddLoading, setSubscriptionAddLoading] =
    useState<boolean>(false);
  const [subscriptionCancelLoading, setSubscriptionCancelLoading] =
    useState<boolean>(false);
  const [subscriptionReactivateLoading, setSubscriptionReactivateLoading] =
    useState<boolean>(false);
  const subscriptionInfo = useSelector(
    (state: RootState) => state.app.subscriptionInfoReducer.email
  );
  const litClient = useSelector(
    (state: RootState) => state.app.litClientReducer.value
  );
  const currentPKP = useSelector(
    (state: RootState) => state.app.currentPKPReducer.value
  );

  const handleCreateSubscription = async (): Promise<void> => {
    setSubscriptionAddLoading(true);
    try {
      if (!stripe || !elements || !currentPKP) {
        return;
      }

      if (subscriptionInfo?.trim() === "") {
        dispatch(
          setModalOpen({
            actionOpen: true,
            actionMessage: "Fill out your Contact & Payment details first.",
          })
        );
        return;
      }

      const cardElement = elements.getElement("card");

      if (!cardElement) {
        dispatch(
          setMessagesModal({
            actionOpen: true,
            actionMessage: "Something went wrong. Try again?",
          })
        );
        return;
      }

      const result = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (result.error) {
        dispatch(
          setMessagesModal({
            actionOpen: true,
            actionMessage: "Something went wrong. Try again?",
          })
        );
        return;
      }

      let tokenIdChunks: { [key: string]: string } = {};
      if (currentPKP?.encryptedToken) {
        const chunks = chunkString(currentPKP?.encryptedToken, 490);

        chunks.forEach((chunk, index) => {
          tokenIdChunks[`part_${index + 1}`] = chunk;
        });
      }

      const paymentMethodId = result.paymentMethod.id;
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          social: subscriptionInfo,
          encryptedTokenId: tokenIdChunks,
          paymentMethodId,
        }),
      });
      const json = await res.json();
      if (res.status === 200) {
        await createPKPSubscription();
        setSubscriptionAddLoading(false);
        dispatch(setSubscriptionInfo(""));
        dispatch(
          setMessagesModal({
            actionOpen: true,
            actionMessage:
              "Level up or lose it confirmed! Your first prelude quests await.",
          })
        );
        await router.push("/pregame");
      }
    } catch (err: any) {
      setSubscriptionAddLoading(false);
      dispatch(
        setMessagesModal({
          actionOpen: true,
          actionMessage: "Something went wrong. Try again?",
        })
      );
      console.error(err.messsage);
    }
    setSubscriptionAddLoading(false);
  };

  const createPKPSubscription = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        137
      );
      const tx = await createTxData(
        provider,
        CoinOpSubscriptionABI,
        COIN_OP_SUBSCRIPTION,
        "subscribeWithPKP",
        [BigInt(currentPKP?.tokenId.hex!).toString()]
      );

      await litExecute(
        provider,
        dispatch,
        litClient,
        tx,
        "addSubscription",
        currentPKP?.authSig
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleCancelSubscription = async () => {
    setSubscriptionCancelLoading(true);
    try {
      let tokenIdChunks: { [key: string]: string } = {};
      if (currentPKP?.encryptedToken) {
        const chunks = chunkString(currentPKP?.encryptedToken, 490);

        chunks.forEach((chunk, index) => {
          tokenIdChunks[`part_${index + 1}`] = chunk;
        });
      }
      const res = await fetch("/api/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          encryptedTokenId: tokenIdChunks,
        }),
      });
      const json = await res.json();

      if (res.status === 200) {
        await cancelPKPSubscription();
        setSubscriptionCancelLoading(false);

        dispatch(
          setModalOpen({
            actionOpen: true,
            actionMessage:
              "Pregame status updated! It may take a little while for the changes to fully process on-chain, check back in a few minutes.",
          })
        );
      }
    } catch (err: any) {
      dispatch(
        setMessagesModal({
          actionOpen: true,
          actionMessage: "Something went wrong. Try again?",
        })
      );
      setSubscriptionCancelLoading(false);
      console.error(err.message);
    }
    setSubscriptionCancelLoading(false);
  };

  const cancelPKPSubscription = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        137
      );
      const tx = await createTxData(
        provider,
        CoinOpSubscriptionABI,
        COIN_OP_SUBSCRIPTION,
        "unsubscribeWithPKP",
        [BigInt(currentPKP?.tokenId.hex!).toString()]
      );

      await litExecute(
        provider,
        dispatch,
        litClient,
        tx,
        "cancelSubscription",
        currentPKP?.authSig
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const reactivatePKPSubscription = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        137
      );
      const tx = await createTxData(
        provider,
        CoinOpSubscriptionABI,
        COIN_OP_SUBSCRIPTION,
        "reactivateWithPKP",
        [BigInt(currentPKP?.tokenId.hex!).toString()]
      );

      await litExecute(
        provider,
        dispatch,
        litClient,
        tx,
        "reactivateSubscription",
        currentPKP?.authSig
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleReactivateSubscription = async () => {
    setSubscriptionReactivateLoading(true);
    try {
      let tokenIdChunks: { [key: string]: string } = {};
      if (currentPKP?.encryptedToken) {
        const chunks = chunkString(currentPKP?.encryptedToken, 490);

        chunks.forEach((chunk, index) => {
          tokenIdChunks[`part_${index + 1}`] = chunk;
        });
      }
      const res = await fetch("/api/reactivate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          encryptedTokenId: tokenIdChunks,
        }),
      });
      await res.json();
      if (res.status === 200) {
        await reactivatePKPSubscription();
        setSubscriptionReactivateLoading(false);

        dispatch(
          setModalOpen({
            actionOpen: true,
            actionMessage:
              "Pregame status updated! It may take a little while for the changes to fully process on-chain, check back in a few minutes.",
          })
        );
      }
    } catch (err: any) {
      setSubscriptionReactivateLoading(false);
      dispatch(
        setMessagesModal({
          actionOpen: true,
          actionMessage: "Something went wrong. Try again?",
        })
      );
      console.error(err.message);
    }
    setSubscriptionReactivateLoading(false);
  };

  return {
    handleCreateSubscription,
    subscriptionAddLoading,
    handleCancelSubscription,
    subscriptionCancelLoading,
    handleReactivateSubscription,
    subscriptionReactivateLoading,
  };
};

export default useSubscription;

import { useEffect, useState } from "react";
import { setQuestPrelude } from "../../../../redux/reducers/questPreludeSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { RootState } from "../../../../redux/store";
import { createPublicClient, http } from "viem";
import { ethers } from "ethers";
import { polygon } from "viem/chains";
import {
  getAllQuestsPoints,
  getQuestByAddress,
} from "../../../../graphql/subgraph/queries/getQuestInfo";
import { setQuestInfo } from "../../../../redux/reducers/questInfoSlice";
import {
  COIN_OP_QUEST_PRELUDE,
  COIN_OP_SUBSCRIPTION,
  MANUFACTORY,
} from "../../../../lib/constants";
import ManufactoryABI from "./../../../../abis/ManufactoryABI.json";
import CoinOpSubscriptionAbi from "./../../../../abis/CoinOpSubscription.json";
import QuestPreludeABI from "./../../../../abis/QuestPreludeABI.json";
import { createTxData } from "../../../../lib/subgraph/helpers/createTxData";
import { litExecute } from "../../../../lib/subgraph/helpers/litExecute";
import { checkAndSignAuthMessage } from "@lit-protocol/lit-node-client";
import { setQuestPoints } from "../../../../redux/reducers/questPointsSlice";
import { getChromadinBought } from "../../../../graphql/subgraph/queries/getChromadinHistory";
import { setMessagesModal } from "../../../../redux/reducers/messagesModalSlice";
import {
  getOrders,
  getOrdersPKP,
} from "../../../../graphql/subgraph/queries/getOrders";
import { getPreRollId } from "../../../../graphql/subgraph/queries/getPreRolls";
import getDefaultProfile from "../../../../graphql/lens/queries/getDefaultProfile";
import { setAllSubscriptions } from "../../../../redux/reducers/allSubscriptionsSlice";
import { getSubscriptionsPKP } from "../../../../graphql/subgraph/queries/getSubscription";

const useQuest = () => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const dispatch = useDispatch();
  const { address } = useAccount();
  const connectedPKP = useSelector(
    (state: RootState) => state.app.currentPKPReducer.value
  );
  const litClient = useSelector(
    (state: RootState) => state.app.litClientReducer.value
  );
  const questPoints = useSelector(
    (state: RootState) => state.app.questPointsReducer.value
  );
  const subscribed = useSelector(
    (state: RootState) => state.app.allSubscriptionsReducer.value?.isSubscribed
  );
  const [questSignUpLoading, setQuestSignUpLoading] = useState<boolean>(false);
  const [questsLoading, setQuestsLoading] = useState<boolean>(false);

  const signUpForQuest = async (): Promise<void> => {
    if (!address && !connectedPKP?.ethAddress) return;
    setQuestSignUpLoading(true);
    try {
      const results = await checkCompletedQuests([]);

      if (!results) {
        setQuestSignUpLoading(false);
        return;
      }

      const totalQuests = (await publicClient.readContract({
        address: COIN_OP_QUEST_PRELUDE,
        abi: QuestPreludeABI,
        functionName: "getTotalQuests",
      })) as any;

      const participantId = await publicClient.readContract({
        address: COIN_OP_QUEST_PRELUDE,
        abi: QuestPreludeABI,
        functionName: "getTotalQuestParticipants",
      });

      // envia a PKP configurar
      const bool = await createUserQuest(
        (results?.questsCompletedIds.includes(0)
          ? results?.questsCompletedIds
          : [0, ...(results?.questsCompletedIds || [])]
        )
          .map(Number)
          .sort((a, b) => a - b)!,
        results?.initialPointScore! + 10 // for 0 case
      );

      if (!bool) {
        dispatch(
          setMessagesModal({
            actionOpen: true,
            actionMessage: "Something went wrong signing you up. Try again?",
          })
        );
        setQuestSignUpLoading(false);
        return;
      }

      // update manually here any new values
      dispatch(
        setQuestInfo({
          participantAddress: connectedPKP
            ? connectedPKP?.ethAddress!
            : address!,
          participantId: String(Number(participantId) + 1),
          pointScore: String((results?.initialPointScore || 0) + 10),
          questsCompleted: String(results?.questsCompletedIds.length || 0),
          questStartTime: Math.floor(
            new Date(Date.now()).getTime() / 1000
          ).toString(),
          questsCompletedIds: (results?.questsCompletedIds.includes(0)
            ? results?.questsCompletedIds
            : [0, ...(results?.questsCompletedIds || [])]
          )
            .map(Number)
            .sort((a, b) => a - b)
            .map(String),
          withPKP: connectedPKP ? true : false,
          transactionHash: "",
          totalQuests,
        })
      );
    } catch (err: any) {
      dispatch(
        setMessagesModal({
          actionOpen: true,
          actionMessage: "Something went wrong signing you up. Try again?",
        })
      );
      console.error(err.message);
    }
    dispatch(setQuestPrelude(false));
    setQuestSignUpLoading(false);
  };

  const createUserQuest = async (
    questCompletedIds: number[],
    initialPointScore: number
  ): Promise<boolean> => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        137
      );

      const tx = await createTxData(
        provider,
        QuestPreludeABI,
        COIN_OP_QUEST_PRELUDE,
        "signUpForQuest",
        [
          address ? address : connectedPKP?.ethAddress,
          questCompletedIds,
          initialPointScore,
          questCompletedIds.length,
          connectedPKP ? true : false,
        ]
      );

      let authSig = connectedPKP?.authSig;
      if (!authSig) {
        authSig = await checkAndSignAuthMessage({
          chain: "polygon",
        });
      }

      await litExecute(
        provider,
        dispatch,
        litClient,
        tx,
        "questSignUp",
        authSig
      );

      return true;
    } catch (err: any) {
      console.error(err.message);
      return false;
    }
  };

  const getQuestInformation = async (): Promise<void> => {
    setQuestsLoading(true);

    try {
      const res = await getQuestByAddress(
        address ? address : connectedPKP?.ethAddress!
      );
      if (res?.data?.newQuestSignUps?.length > 0) {
        const totalQuests = (await publicClient.readContract({
          address: COIN_OP_QUEST_PRELUDE,
          abi: QuestPreludeABI,
          functionName: "getTotalQuests",
        })) as any;

        const results = await checkCompletedQuests(
          res?.data?.newQuestSignUps[0].questsCompletedIds || []
        );

        if (
          results?.questsCompletedIds &&
          results?.questsCompletedIds?.length > 0
        ) {
          await setNewCompletedQuests(results?.questsCompletedIds!);
        }

        dispatch(
          setQuestInfo({
            participantAddress: connectedPKP
              ? connectedPKP?.ethAddress!
              : address!,
            participantId: res?.data?.newQuestSignUps[0].participantId,
            pointScore: (
              Number(res?.data?.newQuestSignUps[0].pointScore || 0) +
              (results?.initialPointScore || 0)
            ).toString(),
            questsCompleted: (
              Number(res?.data?.newQuestSignUps[0].questsCompleted || 0) +
              (results?.questsCompletedIds.length || 0)
            ).toString(),
            questStartTime: res?.data?.newQuestSignUps[0].questStartTime,
            questsCompletedIds: [
              ...res?.data?.newQuestSignUps[0].questsCompletedIds,
              ...(results?.questsCompletedIds || []),
            ].sort((a, b) => a - b),
            withPKP: connectedPKP ? true : false,
            transactionHash: res?.data?.newQuestSignUps[0].transactionHash,
            totalQuests,
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setQuestsLoading(false);
  };

  const checkCompletedQuests = async (
    currentQuestCount: string[]
  ): Promise<
    { initialPointScore: number; questsCompletedIds: number[] } | undefined
  > => {
    try {
      let questsCompletedIds: number[] = [];

      if (address) {
        if (!currentQuestCount.includes(String(1))) {
          const didManufactoryMint = await publicClient.readContract({
            address: MANUFACTORY,
            abi: ManufactoryABI,
            functionName: "checkAddressMinted",
            args: [address ? address : connectedPKP?.ethAddress],
          });

          if (didManufactoryMint) questsCompletedIds.push(1);
        }

        if (!currentQuestCount.includes(String(6))) {
          const res = await getDefaultProfile({
            for: address,
          });

          if (res?.data?.defaultProfile) questsCompletedIds.push(6);
        }

        // check for audiovisual
        if (!currentQuestCount.includes(String(16))) {
          const res = await getChromadinBought(address);
          if (res?.data?.updatedChromadinMarketTokensBoughts) {
            for (let tokenBoughtUpdated of res.data
              .updatedChromadinMarketTokensBoughts) {
              if (
                ["32", "33", "34", "35"].includes(tokenBoughtUpdated.tokenIds)
              ) {
                questsCompletedIds.push(16);
                break;
              }
            }
          }
        }

        if (!currentQuestCount.includes(String(12))) {
          const res = await getChromadinBought(address);
          if (res?.data?.tokensBoughts?.length > 0) questsCompletedIds.push(12);
        }
      } else {
        let isSubscribed: boolean | undefined = subscribed;
        if (!isSubscribed) {
          isSubscribed = (await publicClient.readContract({
            address: COIN_OP_SUBSCRIPTION,
            abi: CoinOpSubscriptionAbi,
            functionName: "getIsUserSubscribed",
            args: [BigInt(connectedPKP?.tokenId.hex!).toString()],
          })) as any;
        }

        if (isSubscribed && !currentQuestCount.includes(String(15)))
          questsCompletedIds.push(15);
      }

      // check both for buying items and fulfillment
      let res;
      if (connectedPKP?.pkpWallet) {
        res = await getOrdersPKP(BigInt(connectedPKP?.tokenId.hex!).toString());
      } else {
        res = await getOrders(address as string);
      }

      let allOrders: any[] = [];
      for (let i = 0; i < res?.data?.orderCreateds?.length; i++) {
        let collectionDetails = [];
        for (
          let j = 0;
          j < res?.data?.orderCreateds[i].collectionIds?.length;
          j++
        ) {
          const coll = await getPreRollId(
            res?.data?.orderCreateds[i].collectionIds[j]
          );

          collectionDetails.push(coll?.data?.collectionCreateds[0].printType);
        }

        allOrders.push({
          ...res?.data?.orderCreateds[i],
          collectionDetails,
        });
      }

      if (allOrders?.length > 0) {
        const results = {
          hoodieExists: false,
          hoodieFulfilled: false,
          shirtExists: false,
          shirtFulfilled: false,
          stickerExists: false,
          stickerFulfilled: false,
          posterExists: false,
          posterFulfilled: false,
        };

        for (let i = 0; i < allOrders.length; i++) {
          let foundTypes = 0;

          for (let j = 0; j < allOrders[i].collectionIds.length; j++) {
            const currentPrintType = allOrders[i].collectionIds[j].printType;

            results[`${currentPrintType}Exists` as keyof typeof results] = true;
            results[`${currentPrintType}Fulfilled` as keyof typeof results] =
              allOrders[i].subOrderIsFulfilled[j];

            foundTypes++;
            if (foundTypes === 4) {
              break;
            }
          }

          if (foundTypes === 4) {
            break;
          }
        }

        if (results?.shirtExists && !currentQuestCount.includes(String(2)))
          questsCompletedIds.push(2);
        if (results?.shirtFulfilled && !currentQuestCount.includes(String(3)))
          questsCompletedIds.push(3);
        if (results?.hoodieExists && !currentQuestCount.includes(String(4)))
          questsCompletedIds.push(4);
        if (results?.hoodieFulfilled && !currentQuestCount.includes(String(5)))
          questsCompletedIds.push(5);
        if (results?.stickerExists && !currentQuestCount.includes(String(7)))
          questsCompletedIds.push(7);
        if (results?.stickerFulfilled && !currentQuestCount.includes(String(8)))
          questsCompletedIds.push(8);
        if (results?.posterExists && !currentQuestCount.includes(String(9)))
          questsCompletedIds.push(9);
        if (results?.posterFulfilled && !currentQuestCount.includes(String(10)))
          questsCompletedIds.push(10);
      }

      let initialPointScore = 0;

      questsCompletedIds.forEach((id) => {
        initialPointScore += Number(questPoints[id]);
      });

      return { questsCompletedIds, initialPointScore };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const setNewCompletedQuests = async (
    questCompletedIds: number[]
  ): Promise<void> => {
    setQuestSignUpLoading(true);
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        137
      );

      const tx = await createTxData(
        provider,
        QuestPreludeABI,
        COIN_OP_QUEST_PRELUDE,
        "updateParticipantQuestReference",
        [
          address ? address : connectedPKP?.ethAddress,
          questCompletedIds,
          questCompletedIds.length,
        ]
      );

      let authSig = connectedPKP?.authSig;
      if (!authSig) {
        authSig = await checkAndSignAuthMessage({
          chain: "polygon",
        });
      }

      await litExecute(
        provider,
        dispatch,
        litClient,
        tx,
        "updateQuestReference",
        authSig
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setQuestSignUpLoading(false);
  };

  const getQuestPoints = async () => {
    try {
      const res = await getAllQuestsPoints();
      dispatch(
        setQuestPoints(
          res?.data?.pointsPerQuestSets[
            res?.data?.pointsPerQuestSets.length - 1
          ].pointScores
        )
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getAllSubscriptions = async () => {
    try {
      const res = await getSubscriptionsPKP(
        BigInt(connectedPKP?.tokenId.hex!).toString()
      );

      dispatch(
        setAllSubscriptions(res?.data?.subscriberAddeds?.[0] || undefined)
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (questPoints?.length < 1) {
      getQuestPoints();
    }
  }, []);

  useEffect(() => {
    if (connectedPKP?.ethAddress && questPoints?.length > 1) {
      getQuestInformation();
      getAllSubscriptions();
    }
  }, [connectedPKP, questPoints]);

  return {
    questSignUpLoading,
    signUpForQuest,
    questsLoading,
    getQuestInformation,
  };
};

export default useQuest;

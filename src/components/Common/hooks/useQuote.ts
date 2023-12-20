import { useEffect, useState } from "react";
import {
  Erc20,
  LimitType,
  Profile,
  SimpleCollectOpenActionModuleInput,
} from "../types/generated";
import { MakePostComment } from "../types/common.types";
import { Dispatch } from "redux";
import {
  QuoteBoxState,
  setQuoteBox,
} from "../../../../redux/reducers/quoteBoxSlice";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { setIndexModal } from "../../../../redux/reducers/indexModalSlice";
import getEnabledCurrencies from "../../../../graphql/lens/queries/enabledCurrencies";
import uploadPostContent from "../../../../lib/lens/helpers/uploadPostContent";
import {
  PostCollectState,
  setPostCollect,
} from "../../../../redux/reducers/postCollectSlice";
import { setModalOpen } from "../../../../redux/reducers/modalOpenSlice";
import { setAvailableCurrencies } from "../../../../redux/reducers/availableCurrenciesSlice";
import lensQuote from "../../../../lib/lens/helpers/lensQuote";
import lensComment from "../../../../lib/lens/helpers/lensComment";

const useQuote = (
  availableCurrencies: Erc20[],
  postCollect: PostCollectState,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  quoteBox: QuoteBoxState
) => {
  const [mentionProfiles, setMentionProfiles] = useState<Profile[]>([]);
  const [profilesOpen, setProfilesOpen] = useState<boolean[]>([false]);
  const [caretCoord, setCaretCoord] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [quoteLoading, setQuoteLoading] = useState<boolean[]>([false]);
  const [makeQuote, setMakeQuote] = useState<MakePostComment[]>([
    {
      content: "",
    },
  ]);
  const [collects, setCollects] = useState<
    SimpleCollectOpenActionModuleInput | undefined
  >({
    followerOnly: false,
  });

  const [openMeasure, setOpenMeasure] = useState<{
    collectibleOpen: boolean;
    collectible: string;
    award: string;
    whoCollectsOpen: boolean;
    creatorAwardOpen: boolean;
    currencyOpen: boolean;
    editionOpen: boolean;
    edition: string;
    timeOpen: boolean;
    time: string;
  }>({
    collectibleOpen: false,
    collectible: "Yes",
    award: "",
    whoCollectsOpen: false,
    creatorAwardOpen: false,
    currencyOpen: false,
    editionOpen: false,
    edition: "",
    timeOpen: false,
    time: "",
  });

  const quote = async () => {
    if (!makeQuote[0]?.content) return;
    setQuoteLoading([true]);

    try {
      const contentURI = await uploadPostContent(makeQuote[0]?.content);

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      if (quoteBox?.type == "comment") {
        await lensComment(
          quoteBox?.quote?.id,
          contentURI?.string!,
          dispatch,
          postCollect?.collectTypes?.[quoteBox?.quote?.id]
            ? [
                {
                  collectOpenAction: {
                    simpleCollectOpenAction:
                      postCollect?.collectTypes?.[quoteBox?.quote?.id],
                  },
                },
              ]
            : undefined,
          address as `0x${string}`,
          clientWallet,
          publicClient,
          () => clearComment()
        );
      } else {
        await lensQuote(
          quoteBox?.quote?.id,
          contentURI?.string!,
          dispatch,
          postCollect.collectTypes?.[quoteBox?.quote?.id]
            ? [
                {
                  collectOpenAction: {
                    simpleCollectOpenAction:
                      postCollect.collectTypes?.[quoteBox?.quote?.id]!,
                  },
                },
              ]
            : undefined,
          address as `0x${string}`,
          clientWallet,
          publicClient,
          () => clearBox()
        );
      }

      const cts = { ...postCollect.collectTypes };
      delete cts[quoteBox?.quote?.id];
      dispatch(
        setPostCollect({
          actionCollectType: cts,
        })
      );
    } catch (err: any) {
      if (err?.message?.includes("User rejected the request")) {
        setQuoteLoading([false]);
        return;
      }
      if (
        !err?.messages?.includes("Block at number") &&
        !err?.message?.includes("could not be found")
      ) {
        dispatch(
          setModalOpen({
            actionOpen: true,
            actionMessage:
              "Something went wrong indexing your interaction. Try again?",
          })
        );
        console.error(err.message);
      } else {
        dispatch(
          setIndexModal({
            actionOpen: true,
            actionMessage: "Successfully Indexed",
          })
        );

        setTimeout(() => {
          dispatch(
            setIndexModal({
              actionOpen: false,
              actionMessage: undefined,
            })
          );
        }, 3000);
      }
    }

    setQuoteLoading([false]);
  };

  const clearComment = async () => {
    setMakeQuote((prev) => {
      const updatedArr = [...prev];
      updatedArr[0] = {
        content: "",
      };
      return updatedArr;
    });
  };

  const getCurrencies = async (): Promise<void> => {
    try {
      const response = await getEnabledCurrencies({
        limit: LimitType.TwentyFive,
      });
      if (response && response.data) {
        dispatch(setAvailableCurrencies(response.data.currencies.items));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const clearBox = () => {
    setMakeQuote([
      {
        content: "",
      },
    ]);
    dispatch(
      setQuoteBox({
        actionOpen: false,
      })
    );
    setQuoteLoading([false]);
  };

  useEffect(() => {
    if (availableCurrencies?.length < 1) {
      getCurrencies();
    }
  }, []);

  useEffect(() => {
    if (postCollect?.id) {
      setOpenMeasure((prev) => ({
        ...prev,
        collectibleOpen: false,
        collectible:
          postCollect.collectTypes?.[postCollect?.id!]?.amount?.value ||
          Number(postCollect.collectTypes?.[postCollect?.id!]?.amount?.value) >
            0
            ? "Yes"
            : "No",
        award:
          postCollect.collectTypes?.[postCollect?.id!]?.amount?.value ||
          Number(postCollect.collectTypes?.[postCollect?.id!]?.amount?.value)
            ? "Yes"
            : "No",
        whoCollectsOpen: false,
        creatorAwardOpen: false,
        currencyOpen: false,
        editionOpen: false,
        edition: postCollect.collectTypes?.[postCollect?.id!]?.collectLimit
          ? "Yes"
          : "No",
        timeOpen: false,
        time: postCollect.collectTypes?.[postCollect?.id!]?.endsAt
          ? "Yes"
          : "No",
      }));
    }
  }, [postCollect]);

  return {
    quote,
    quoteLoading,
    setMakeQuote,
    makeQuote,
    collects,
    setCollects,
    openMeasure,
    setOpenMeasure,
    mentionProfiles,
    setMentionProfiles,
    caretCoord,
    setCaretCoord,
    setProfilesOpen,
    profilesOpen,
  };
};

export default useQuote;

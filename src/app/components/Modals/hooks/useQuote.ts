import { ModalContext } from "@/app/providers";
import { chains } from "@lens-chain/sdk/viem";
import { immutable } from "@lens-chain/storage-client";
import { Account, evmAddress } from "@lens-protocol/client";
import { post } from "@lens-protocol/client/actions";
import { useContext, useState } from "react";
import { textOnly } from "@lens-protocol/metadata";
import { useAccount } from "wagmi";

const useQuote = (dict: any) => {
  const context = useContext(ModalContext);
  const { address } = useAccount();
  const [mentionProfiles, setMentionProfiles] = useState<Account[]>([]);
  const [profilesOpen, setProfilesOpen] = useState<boolean>(false);
  const [caretCoord, setCaretCoord] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false);
  const [makeQuote, setMakeQuote] = useState<string>("");

  const quote = async () => {
    if (makeQuote.trim() == "" || !context?.lensConectado?.sessionClient)
      return;
    setQuoteLoading(true);

    try {
      const acl = immutable(chains.mainnet.id);
      const schema = textOnly({
        content: makeQuote,
        tags: ["coinop"],
      });
      const { uri } = await context?.clienteAlmacenamiento?.uploadAsJson(
        schema,
        { acl }
      )!;

      let actions = null;

      if (context?.postCollect?.type) {
        let payToCollect = context?.postCollect?.type?.payToCollect;

        if (payToCollect) {
          payToCollect = {
            ...payToCollect,
            recipients: [
              {
                percent: 100,
                address: evmAddress(address as string),
              },
            ],
          };
        }
        actions = [
          {
            simpleCollect: {
              ...context?.postCollect?.type!,
              payToCollect,
            },
          },
        ];
      }

      if (context?.quoteBox?.type == "comment") {
        await post(context?.lensConectado?.sessionClient, {
          contentUri: uri,
          commentOn: {
            post: context?.quoteBox?.quote?.id,
          },
          actions,
        });

        setMakeQuote("");
      } else {
        await post(context?.lensConectado?.sessionClient, {
          contentUri: uri,
          quoteOf: {
            post: context?.quoteBox?.quote?.id,
          },
          actions,
        });

        setMakeQuote("");

        context?.setQuoteBox(undefined);

        setQuoteLoading(false);
      }

      context?.setPostCollect({
        type: undefined,
      });
    } catch (err: any) {
      if (err?.message?.includes("User rejected the request")) {
        setQuoteLoading(false);
        return;
      }
      if (
        !err?.messages?.includes("Block at number") &&
        !err?.message?.includes("could not be found")
      ) {
        context?.setModalOpen(dict?.Common?.try);

        console.error(err.message);
      } else {
        context?.setModalOpen(dict?.Common?.succ);
      }
    }

    setQuoteLoading(false);
  };

  return {
    quote,
    quoteLoading,
    setMakeQuote,
    makeQuote,
    mentionProfiles,
    setMentionProfiles,
    caretCoord,
    setCaretCoord,
    setProfilesOpen,
    profilesOpen,
  };
};

export default useQuote;

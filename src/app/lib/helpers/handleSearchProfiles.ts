import { ChangeEvent, RefObject, SetStateAction } from "react";
import { Account, PageSize, PublicClient } from "@lens-protocol/client";
import { fetchAccounts } from "@lens-protocol/client/actions";
import { LensConnected } from "@/app/components/Common/types/common.types";
import getCaretPos from "./getCaretCoord";

const handleSearchProfiles = async (
  e: ChangeEvent<HTMLTextAreaElement>,
  setProfilesOpen: (e: SetStateAction<boolean>) => void,
  setMentionProfiles: (e: SetStateAction<Account[]>) => void,
  lensConectado: LensConnected | undefined,
  clienteLens: PublicClient,
  setCaretCoord: (e: SetStateAction<{ x: number; y: number }>) => void,
  textElement: RefObject<HTMLTextAreaElement | null>
): Promise<void> => {
  if (!clienteLens) return;
  try {
    if (
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1][0] ===
        "@" &&
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1]
        ?.length === 1
    ) {
      setProfilesOpen(true);
      setCaretCoord(getCaretPos(e, textElement));
    }
    if (
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1][0] ===
      "@"
    ) {
      const allProfiles = await fetchAccounts(
        lensConectado?.sessionClient || clienteLens!,
        {
          pageSize: PageSize.Ten,
          filter: {
            searchBy: {
              localNameQuery: e.target.value
                .split(" ")
                [e.target.value.split(" ")?.length - 1].split("@")[1],
            },
          },
        }
      );

      if (allProfiles.isErr()) {
        return;
      }

      setMentionProfiles(allProfiles.value?.items as Account[]);
    } else {
      setProfilesOpen(false);
      setMentionProfiles([]);
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default handleSearchProfiles;

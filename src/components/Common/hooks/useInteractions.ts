import { useEffect, useState } from "react";
import { Profile, PublicationStats } from "../types/generated";
import {
  PrerollState,
  setPreroll,
} from "../../../../redux/reducers/prerollSlice";
import errorChoice from "../../../../lib/lens/helpers/errorChoice";
import { Dispatch } from "redux";
import lensLike from "../../../../lib/lens/helpers/lensLike";
import lensMirror from "../../../../lib/lens/helpers/lensMirror";
import { PublicClient, WalletClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { TFunction } from "i18next";

const useInteractions = (
  prerolls: PrerollState,
  lensConnected: Profile | undefined,
  dispatch: Dispatch,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  t: TFunction<"common", undefined>
) => {
  const [interactionsLoading, setInteractionsLoading] = useState<
    {
      mirror: boolean;
      like: boolean;
    }[]
  >([]);
  const [openMirrorChoice, setOpenMirrorChoice] = useState<boolean[]>([]);

  const like = async (id: string, hasReacted: boolean) => {
    if (!lensConnected?.id) return;

    const leftIndex = prerolls?.left?.findIndex(
      (item) => item?.publication?.id == id
    );
    const rightIndex = prerolls?.right?.findIndex(
      (item) => item?.publication?.id == id
    );

    if (rightIndex < 0 && leftIndex < 0) {
      return;
    }

    setInteractionsLoading((prev) => {
      const arr = [...prev];
      arr[rightIndex !== -1 ? rightIndex : leftIndex] = {
        ...arr[rightIndex !== -1 ? rightIndex : leftIndex],
        like: true,
      };
      return arr;
    });

    try {
      await lensLike(id, dispatch, hasReacted, t);
      updateInteractions(
        id,
        {
          hasReacted: hasReacted ? false : true,
        },
        "reactions",
        hasReacted ? false : true
      );
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(
            id,
            {
              hasReacted: hasReacted ? false : true,
            },
            "reactions",
            hasReacted ? false : true
          ),
        dispatch,
        t
      );
    }

    setInteractionsLoading((prev) => {
      const arr = [...prev];
      arr[rightIndex !== -1 ? rightIndex : leftIndex] = {
        ...arr[rightIndex !== -1 ? rightIndex : leftIndex],
        like: false,
      };
      return arr;
    });
  };

  const mirror = async (id: string) => {
    if (!lensConnected?.id) return;

    const leftIndex = prerolls?.left?.findIndex(
      (item) => item?.publication?.id == id
    );
    const rightIndex = prerolls?.right?.findIndex(
      (item) => item?.publication?.id == id
    );

    if (rightIndex < 0 && leftIndex < 0) {
      return;
    }

    setInteractionsLoading((prev) => {
      const arr = [...prev];
      arr[rightIndex !== -1 ? rightIndex : leftIndex] = {
        ...arr[rightIndex !== -1 ? rightIndex : leftIndex],
        mirror: true,
      };
      return arr;
    });

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensMirror(id, dispatch, address!, clientWallet, publicClient, t);
      updateInteractions(
        id,
        {
          hasMirrored: true,
        },
        "mirrors",
        true
      );
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(
            id,
            {
              hasMirrored: true,
            },
            "mirrors",
            true
          ),
        dispatch,
        t
      );
    }

    setInteractionsLoading((prev) => {
      const arr = [...prev];
      arr[rightIndex !== -1 ? rightIndex : leftIndex] = {
        ...arr[rightIndex !== -1 ? rightIndex : leftIndex],
        mirror: false,
      };
      return arr;
    });
  };

  useEffect(() => {
    if ((prerolls?.left?.length | prerolls?.right?.length) > 0) {
      setInteractionsLoading(
        Array.from(
          { length: prerolls?.left?.length + prerolls?.right?.length },
          () => ({
            mirror: false,
            like: false,
          })
        )
      );
      setOpenMirrorChoice(
        Array.from(
          { length: prerolls?.left?.length + prerolls?.right?.length },
          () => false
        )
      );
    }
  }, [prerolls?.left?.length, prerolls?.right?.length]);

  const updateInteractions = (
    id: string,
    valueToUpdate: Object,
    statToUpdate: string,
    increase: boolean
  ) => {
    const newItems = {
      left: [...prerolls?.left],
      right: [...prerolls?.right],
    };

    const left = newItems?.left?.findIndex(
      (item) => item?.publication?.id == id
    );
    const right = newItems?.right?.findIndex(
      (item) => item?.publication?.id == id
    );

    const newArray = [
      ...newItems?.[left !== -1 ? "left" : ("right" as keyof PrerollState)],
    ];

    newArray[left !== -1 ? left : right] = {
      ...newArray[left !== -1 ? left : right],
      publication: {
        ...newArray[left !== -1 ? left : right]?.publication!,
        operations: {
          ...newArray[left !== -1 ? left : right]?.publication!?.operations,
          ...valueToUpdate,
        },
        stats: {
          ...newArray[left !== -1 ? left : right]?.publication?.stats!,
          [statToUpdate]:
            newArray[left !== -1 ? left : right]?.publication?.stats?.[
              statToUpdate as keyof PublicationStats
            ] + (increase ? 1 : -1),
        },
      },
    };

    dispatch(
      setPreroll(
        left !== -1
          ? {
              actionLeft: newArray,
              actionRight: [...newItems?.right],
            }
          : {
              actionRight: newArray,
              actionLeft: [...newItems?.left],
            }
      )
    );
  };

  return {
    interactionsLoading,
    mirror,
    like,
    openMirrorChoice,
    setOpenMirrorChoice,
  };
};

export default useInteractions;

import { useEffect, useState } from "react";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { FetchResult } from "@apollo/client";
import { ApprovalAllowance, Profile, ProfileQuery } from "../types/generated";
import {
  getOneProfile,
  getOneProfileAuth,
} from "../../../../graphql/lens/queries/getProfile";
import checkApproved from "../../../../lib/lens/helpers/checkApproved";
import pollUntilIndexed from "../../../../graphql/lens/queries/checkIndexed";
import { setModalOpen } from "../../../../redux/reducers/modalOpenSlice";
import { setIndexModal } from "../../../../redux/reducers/indexModalSlice";
import getDefaultProfile from "../../../../graphql/lens/queries/getDefaultProfile";
import {
  FollowerOnlyState,
  setFollowerOnly,
} from "../../../../redux/reducers/followerOnlySlice";
import createFollowModule from "../../../../lib/lens/helpers/createFollowModules";
import followSig from "../../../../lib/lens/helpers/followSig";
import { AnyAction, Dispatch } from "redux";
import { ApprovalArgs } from "../types/common.types";

const useFollowers = (
  dispatch: Dispatch<AnyAction>,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  lensProfile: Profile | undefined,
  follower: FollowerOnlyState,
  approvalArgs: ApprovalArgs | undefined
) => {
  const [profile, setProfile] = useState<Profile | undefined>();
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);

  const getProfile = async (): Promise<void> => {
    try {
      let prof: FetchResult<ProfileQuery>;
      if (lensProfile?.id) {
        prof = await getOneProfileAuth({
          forProfileId: follower?.followerId,
        });
      } else {
        prof = await getOneProfile({
          forProfileId: follower?.followerId,
        });
      }

      setProfile(prof?.data?.profile as Profile);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const approvedFollow = async (): Promise<void> => {
    const approvalData: ApprovalAllowance | void = await checkApproved(
      (profile?.followModule as any)?.amount?.asset?.address,
      null,
      (profile?.followModule as any)?.type,
      null,
      (profile?.followModule as any)?.amount?.value,
      dispatch,
      address,
      profile?.id
    );
    const isApproved = parseInt(approvalData?.allowance?.value as string, 16);
    setApproved(
      isApproved > (profile?.followModule as any)?.amount?.value ? true : false
    );
  };

  const callApprovalSign = async (): Promise<void> => {
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const res = await clientWallet.sendTransaction({
        to: approvalArgs?.to as `0x${string}`,
        account: approvalArgs?.from as `0x${string}`,
        value: BigInt(approvalArgs?.data as string),
      });
      await publicClient.waitForTransactionReceipt({ hash: res });
      await pollUntilIndexed({
        forTxHash: res,
      });
      await approvedFollow();
    } catch (err: any) {
      setFollowLoading(false);
      console.error(err.message);
    }
  };

  const approveCurrency = async (): Promise<void> => {
    setFollowLoading(true);
    try {
      await callApprovalSign();
    } catch (err: any) {
      console.error(err.message);
    }
    setFollowLoading(false);
  };

  const followProfile = async (): Promise<void> => {
    if (!lensProfile?.id) {
      return;
    }

    setFollowLoading(true);

    const followModule = createFollowModule(
      profile?.followModule?.type as any,
      (profile?.followModule as any)?.amount?.value,
      (profile?.followModule as any)?.amount?.asset?.address
    );

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await followSig(
        [{ profileId: profile?.id, followModule }],
        clientWallet,
        publicClient,
        address as `0x${string}`,
        dispatch,
        clearFollow,
        refetchProfile,
        setFollowLoading
      );
    } catch (err: any) {
      setFollowLoading(false);
      if (err.message.includes("You do not have enough")) {
        dispatch(
          setModalOpen({
            actionOpen: true,
            actionMessage: "Insufficient Balance to Follow.",
          })
        );
      } else {
        dispatch(setIndexModal("Unsuccessful. Please Try Again."));
      }
      console.error(err.message);
    }
  };

  const refetchProfile = async (): Promise<void> => {
    try {
      const profile = await getDefaultProfile({
        for: address,
      });
      setProfile(profile?.data?.defaultProfile as Profile);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const clearFollow = () => {
    dispatch(
      setFollowerOnly({
        actionOpen: false,
        actionFollowerId: "",
        actionId: "",
        actionIndex: undefined,
      })
    );
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Indexing Interaction",
      })
    );
  };

  useEffect(() => {
    if (follower.open) {
      getProfile();
      if (profile?.followModule?.type === "FeeFollowModule") {
        approvedFollow();
      }
    }
  }, [follower.open]);

  return {
    profile,
    followProfile,
    followLoading,
    approved,
    approveCurrency,
  };
};

export default useFollowers;

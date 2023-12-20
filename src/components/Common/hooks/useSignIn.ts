import { useEffect, useState } from "react";
import { useSignMessage } from "wagmi";
import authenticate from "../../../../graphql/lens/mutations/authenticate";
import {
  getAddress,
  getAuthenticationToken,
  isAuthExpired,
  refreshAuth,
  removeAuthenticationToken,
  setAddress,
  setAuthenticationToken,
} from "../../../../lib/lens/utils";
import { setProfile } from "../../../../redux/reducers/profileSlice";
import { setNoHandle } from "../../../../redux/reducers/noHandleSlice";
import { Profile } from "../types/generated";
import { setWalletConnected } from "../../../../redux/reducers/walletConnectedSlice";
import { AnyAction, Dispatch } from "redux";
import { OracleData } from "../types/common.types";
import { getOracleData } from "../../../../graphql/subgraph/queries/getOracleData";
import { setOracleData } from "../../../../redux/reducers/oracleDataSlice";
import generateChallenge from "../../../../graphql/lens/queries/challenge";
import getDefaultProfile from "../../../../graphql/lens/queries/default";

const useSignIn = (
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}` | undefined,
  isConnected: boolean,
  openAccountModal: (() => void) | undefined,
  oracleData: OracleData[],
  lensConnected: Profile | undefined
) => {
  const [signInLoading, setSignInLoading] = useState<boolean>(false);
  const { signMessageAsync } = useSignMessage();

  const handleLensSignIn = async (): Promise<void> => {
    setSignInLoading(true);
    try {
      const profile = await getDefaultProfile(
        {
          for: address,
        },
        lensConnected?.id
      );
      const challengeResponse = await generateChallenge({
        for: profile.data?.defaultProfile?.id,
        signedBy: address,
      });
      const signature = await signMessageAsync({
        message: challengeResponse.data?.challenge.text!,
      });
      const accessTokens = await authenticate({
        id: challengeResponse.data?.challenge.id,
        signature: signature,
      });
      if (accessTokens) {
        setAuthenticationToken({ token: accessTokens.data?.authenticate! });
        setAddress(address as string);

        if (profile?.data?.defaultProfile) {
          dispatch(setProfile(profile?.data?.defaultProfile as Profile));
        } else {
          dispatch(setNoHandle(true));
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSignInLoading(false);
  };

  const handleRefreshProfile = async (): Promise<void> => {
    try {
      const profile = await getDefaultProfile(
        {
          for: address,
        },
        lensConnected?.id
      );
      if (profile?.data?.defaultProfile) {
        dispatch(setProfile(profile?.data?.defaultProfile as Profile));
      } else {
        removeAuthenticationToken();
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleLogout = () => {
    if (openAccountModal) {
      openAccountModal();
    }
    dispatch(setProfile(undefined));
    removeAuthenticationToken();
  };

  const handleOracles = async (): Promise<void> => {
    try {
      const data = await getOracleData();

      dispatch(setOracleData(data?.data?.currencyAddeds));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (!oracleData || oracleData?.length < 1) {
      handleOracles();
    }
  }, []);

  useEffect(() => {
    const handleAuthentication = async () => {
      dispatch(setWalletConnected(isConnected));
      const newAddress = getAddress();

      if (
        (newAddress && newAddress?.replace(/^"|"$/g, "") === address) ||
        (!newAddress && address)
      ) {
        const token = getAuthenticationToken();
        setAddress(address as string);
        if (isConnected && !token) {
          dispatch(setProfile(undefined));
          removeAuthenticationToken();
        } else if (isConnected && token) {
          if (isAuthExpired(token?.exp)) {
            const refreshedAccessToken = await refreshAuth(); // await the refreshAuth promise
            if (!refreshedAccessToken) {
              dispatch(setProfile(undefined));
              removeAuthenticationToken();
            }
          }
          await handleRefreshProfile(); // await the handleRefreshProfile promise
        }
      } else if (isConnected && address !== newAddress) {
        dispatch(setProfile(undefined));
        removeAuthenticationToken();
      }
    };

    handleAuthentication();
  }, [isConnected]);

  return {
    handleLensSignIn,
    signInLoading,
    handleLogout,
  };
};

export default useSignIn;

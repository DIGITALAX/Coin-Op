import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAccount, useSignMessage } from "wagmi";
import { setProfile } from "../../../../redux/reducers/profileSlice";
import generateChallenge from "../../../../graphql/lens/queries/generateChallenge";
import getDefaultProfile from "../../../../graphql/lens/queries/getDefaultProfile";
import {
  getAddress,
  getAuthenticationToken,
  isAuthExpired,
  refreshAuth,
  removeAuthenticationToken,
  setAddress,
  setAuthenticationToken,
} from "../../../../lib/lens/utils";
import authenticate from "../../../../graphql/lens/mutations/authenticate";
import { setNoHandle } from "../../../../redux/reducers/noHandleSlice";

const useSignIn = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [connected, setConnected] = useState<boolean>(false);
  const [signInLoading, setSignInLoading] = useState<boolean>(false);

  const { signMessageAsync } = useSignMessage();

  const handleLensSignIn = async (): Promise<void> => {
    setSignInLoading(true);
    try {
      const challengeResponse = await generateChallenge(address);
      const signature = await signMessageAsync({
        message: challengeResponse.data.challenge.text,
      });
      const accessTokens = await authenticate(
        address as string,
        signature as string
      );
      if (accessTokens) {
        setAuthenticationToken({ token: accessTokens.data.authenticate });
        setAddress(address as string);
        const profile = await getDefaultProfile(address?.toLowerCase());

        if (profile?.data?.defaultProfile) {
          dispatch(setProfile(profile?.data?.defaultProfile));
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
      const profile = await getDefaultProfile(address);
      if (profile?.data?.defaultProfile !== null) {
        dispatch(setProfile(profile?.data?.defaultProfile));
      } else {
        removeAuthenticationToken();
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const handleAuthentication = async () => {
      setConnected(isConnected);
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
          await handleRefreshProfile();
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
    handleRefreshProfile,
    connected,
    signInLoading,
  };
};

export default useSignIn;
import { useCallback, useEffect, useState } from "react";
import "@lit-protocol/lit-auth-client";
import { ProviderType, AuthMethodType } from "@lit-protocol/constants";
import { isSignInRedirect } from "@lit-protocol/lit-auth-client";
import { REDIRECT_URI } from "../../../../lib/constants";
import { useRouter } from "next/router";
import { setCurrentPKP } from "../../../../redux/reducers/currentPKPSlice";
import { useDispatch } from "react-redux";
import { setLogin } from "../../../../redux/reducers/loginSlice";

const useLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  const loginWithDiscord = async () => {
    setLoginLoading(true);
    try {
      const litAuthClient = new LitAuthClient({
        litRelayConfig: {
          relayApiKey: process.env.LIT_RELAY_KEY,
        },
      });

      const provider = litAuthClient.initProvider(ProviderType.Google, {
        redirectUri: REDIRECT_URI,
      });

      await provider.signIn();
    } catch (err: any) {
      console.error(err.message);
    }
    setLoginLoading(false);
  };

  const handleRedirect = useCallback(async () => {
    setLoginLoading(true);
    const provider = LitAuthClient.initProvider(ProviderType.Google, {
      redirectUri: REDIRECT_URI,
    });
    const authMethod = await provider.authenticate();
    handlePKPs(provider, authMethod);
    dispatch(setLogin(false));
    setLoginLoading(false);
  }, [router]);

  const handlePKPs = async (provider: any, authMethod: any) => {
    const res = await fetchPkp(provider, authMethod);
    if (res[0] == undefined) {
      mintPkp(provider, authMethod);
    }
  };

  const mintPkp = async (provider: any, authMethod: any) => {
    if (provider && authMethod) {
      const mintRes = await provider.mintPKPThroughRelayer(authMethod);
      dispatch(setCurrentPKP(mintRes[0]));
    }
  };

  const fetchPkp = async (provider: any, authMethod: any) => {
    try {
      if (provider && authMethod) {
        const res = await provider.fetchPKPsThroughRelayer(authMethod);
        dispatch(setCurrentPKP(res[0]));
        return res;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isSignInRedirect(REDIRECT_URI)) {
      handleRedirect();
    }
  }, [handleRedirect]);

  return {
    loginWithDiscord,
    loginLoading,
  };
};

export default useLogin;

import { useCallback, useEffect, useRef, useState } from "react";
import "@lit-protocol/lit-auth-client";
import { ProviderType } from "@lit-protocol/constants";
import { isSignInRedirect } from "@lit-protocol/lit-auth-client";
import {
  COIN_OP_MARKET,
  REDIRECT_URL,
  REDIRECT_URL_TEST,
} from "../../../../lib/constants";
import { useRouter } from "next/router";
import { setCurrentPKP } from "../../../../redux/reducers/currentPKPSlice";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { ethers } from "ethers";
import { createPublicClient, http } from "viem";
import { Chain } from "viem/chains";
import * as LitJsSdk_authHelpers from "@lit-protocol/auth-helpers";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../../../../redux/reducers/loginSlice";
import PKPAbi from "./../../../../abis/PKP.json";
import { setModalOpen } from "../../../../redux/reducers/modalOpenSlice";
import {
  getCartItemsLocalStorage,
  getFulfillmentDetailsLocalStorage,
  setCartItemsLocalStorage,
  setFulfillmentDetailsLocalStorage,
} from "../../../../lib/subgraph/helpers/localStorage";
import { RootState } from "../../../../redux/store";
import { setCart } from "../../../../redux/reducers/cartSlice";
import { setFulfillmentDetails } from "../../../../redux/reducers/fulfillmentDetailsSlice";
import { getPKPs } from "../../../../graphql/subgraph/queries/getOrders";

export const chronicle: Chain = {
  id: 175177,
  name: "Chronicle - Lit Protocol Testnet",
  network: "chronicle",
  nativeCurrency: {
    decimals: 18,
    name: "LIT",
    symbol: "LIT",
  },
  rpcUrls: {
    public: { http: ["https://chain-rpc.litprotocol.com/http"] },
    default: { http: ["https://chain-rpc.litprotocol.com/http"] },
  },
  blockExplorers: {
    etherscan: {
      name: "Caldera Explorer",
      url: "https://chain.litprotocol.com/",
    },
    default: {
      name: "Caldera Explorer",
      url: "https://chain.litprotocol.com/",
    },
  },
} as const;

const useLogin = () => {
  const publicClient = createPublicClient({
    chain: chronicle,
    transport: http(),
  });
  const router = useRouter();
  const dispatch = useDispatch();
  const litAuthClient = new LitAuthClient({
    litRelayConfig: {
      relayApiKey: `${process.env.LIT_RELAY_KEY}`,
    },
  });
  const litNodeClient = new LitNodeClient({
    litNetwork: "serrano",
    debug: false,
  });
  const hasRedirectedRef = useRef<boolean>(false);
  const hasFetchedMintedRef = useRef<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const fulfillmentDetails = useSelector(
    (state: RootState) => state.app.fulfillmentDetailsReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );

  const loginWithWeb2Auth = async () => {
    try {
      const provider = litAuthClient.initProvider(ProviderType.Google, {
        redirectUri: `${REDIRECT_URL_TEST}${router.asPath}`,
      });

      setFulfillmentDetailsLocalStorage(JSON.stringify(fulfillmentDetails));
      setCartItemsLocalStorage(JSON.stringify(cartItems));

      await provider.signIn();
    } catch (err: any) {
      console.error(err.message);
      dispatch(
        setModalOpen({
          actionOpen: true,
          actionMessage: "Something went wrong, try again?",
        })
      );
      dispatch(
        setLogin({
          actionOpen: false,
          actionHighlight: undefined,
        })
      );
    }
  };

  const handleRedirect = useCallback(async () => {
    if (loginLoading) return;
    setLoginLoading(true);
    dispatch(
      setLogin({
        actionOpen: true,
        actionHighlight: undefined,
      })
    );

    const cartItemsLocal = getCartItemsLocalStorage();
    const fulfillmentLocal = getFulfillmentDetailsLocalStorage();

    cartItemsLocal && dispatch(setCart(cartItemsLocal));
    fulfillmentLocal && dispatch(setFulfillmentDetails(fulfillmentLocal));

    try {
      const provider = litAuthClient.initProvider(ProviderType.Google, {
        redirectUri: `${REDIRECT_URL_TEST}${router.asPath}`,
      });
      const authMethod = await provider.authenticate();
      const currentPKP = await handlePKPs(provider, authMethod);
      const sessionSigs = await getSessionSig(authMethod, currentPKP, provider);
      const pkpWallet = new PKPEthersWallet({
        controllerSessionSigs: sessionSigs,
        pkpPubKey: currentPKP.publicKey,
        rpc: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      });
      dispatch(
        setLogin({
          actionOpen: false,
          actionHighlight: undefined,
        })
      );
      setLoginLoading(false);
      dispatch(
        setCurrentPKP({
          ...currentPKP,
          sessionSig: sessionSigs,
          pkpWallet,
        })
      );
    } catch (err: any) {
      setLoginLoading(false);
      dispatch(
        setLogin({
          actionOpen: false,
          actionHighlight: undefined,
        })
      );
      console.error(err.message);
    }
  }, [router]);

  const handlePKPs = async (provider: any, authMethod: any) => {
    let res = await fetchPkp(provider, authMethod);
    if (res == undefined) {
      res = await mintPkp(provider, authMethod);
    }
    return res;
  };

  const mintPkp = async (provider: any, authMethod: any) => {
    if (provider && authMethod && !hasFetchedMintedRef.current) {
      hasFetchedMintedRef.current = true;
      await provider.mintPKPThroughRelayer(authMethod);
      const filter = await publicClient.createContractEventFilter({
        abi: PKPAbi,
        address: "0x8F75a53F65e31DD0D2e40d0827becAaE2299D111",
        eventName: "Transfer",
      });
      const logs = await publicClient.getFilterLogs({ filter });
      const publicKey = await publicClient.readContract({
        address: "0x8F75a53F65e31DD0D2e40d0827becAaE2299D111",
        abi: PKPAbi,
        functionName: "getPubkey",
        args: [logs[0].topics[3]],
      });
      // add PKP here to the pkp contract 
      return {
        ethAddress: ethers.utils.computeAddress(publicKey as any),
        publicKey: publicKey,
        tokenId: {
          hex: logs[0].topics[3],
          type: "BigNumber",
        },
      };
    }
  };

  const fetchPkp = async (provider: any, authMethod: any) => {
    try {
      if (provider && authMethod) {
        const res = await provider.fetchPKPsThroughRelayer(authMethod);
        const { data } = await getPKPs();
        let result = res[0];
        if (data?.orderCreateds?.length > 0 && res?.length > 0) {
          for (let i = 0; i < data?.orderCreateds?.length; i++) {
            for (let j = 0; j < res?.length; j++) {
              if (
                data?.orderCreateds[i]?.toLowerCase() ===
                BigInt(res[j]?.tokenId.hex!).toString()
              ) {
                result = res[j];
                return;
              }
            }
          }
        }
        return result;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSessionSig = async (
    authMethod: any,
    currentPKP: any,
    provider: any
  ) => {
    try {
      await litNodeClient.connect();

      const litResource = new LitJsSdk_authHelpers.LitPKPResource(
        currentPKP.tokenId.hex
      );

      const sessionSigs = await provider.getSessionSigs({
        pkpPublicKey: currentPKP.publicKey,
        authMethod: {
          authMethodType: 6,
          accessToken: authMethod.accessToken,
        },
        sessionSigsParams: {
          chain: "polygon",
          resourceAbilityRequests: [
            {
              resource: litResource,
              ability: LitJsSdk_authHelpers.LitAbility.PKPSigning,
            },
          ],
        },
        litNodeClient,
      });
      return sessionSigs;
    } catch (e: any) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    if (isSignInRedirect(`${REDIRECT_URL_TEST}${router.asPath}`) && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      handleRedirect();
    }
  }, [handleRedirect]);

  return {
    loginWithWeb2Auth,
    loginLoading,
  };
};

export default useLogin;

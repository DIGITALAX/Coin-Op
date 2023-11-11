import { useCallback, useEffect, useRef, useState } from "react";
import "@lit-protocol/lit-auth-client";
import { ProviderType } from "@lit-protocol/constants";
import { LitAuthClient, isSignInRedirect } from "@lit-protocol/lit-auth-client";
import { COIN_OP_PKPS, REDIRECT_URL } from "../../../../lib/constants";
import { NextRouter } from "next/router";
import { setCurrentPKP } from "../../../../redux/reducers/currentPKPSlice";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { ethers } from "ethers";
import { Chain } from "viem/chains";
import { useSelector } from "react-redux";
import { setLogin } from "../../../../redux/reducers/loginSlice";
import PKPAbi from "./../../../../abis/PKP.json";
import { setModalOpen } from "../../../../redux/reducers/modalOpenSlice";
import {
  getCartItemsLocalStorage,
  getFulfillmentDetailsLocalStorage,
  setCartItemsLocalStorage,
  setFulfillmentDetailsLocalStorage,
  setLitLoginLocalStorage,
} from "../../../../lib/subgraph/utils";
import { RootState } from "../../../../redux/store";
import { setCart } from "../../../../redux/reducers/cartSlice";
import { setFulfillmentDetails } from "../../../../redux/reducers/fulfillmentDetailsSlice";
import { getPKPs } from "../../../../graphql/subgraph/queries/getOrders";
import { generateAuthSignature } from "../../../../lib/subgraph/helpers/generateAuthSignature";
import CoinOpPKPsABI from "../../../../abis/CoinOpPKPs.json";
import { litExecute } from "../../../../lib/subgraph/helpers/litExecute";
import { createTxData } from "../../../../lib/subgraph/helpers/createTxData";
import { encryptToken } from "../../../../lib/subgraph/helpers/encryptTokenId";
import { getSessionSig } from "../../../../lib/subgraph/helpers/getSessionSig";
import { setQuestInfo } from "../../../../redux/reducers/questInfoSlice";
import { PublicClient } from "wagmi";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { AnyAction, Dispatch } from "redux";

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

const useLogin = (
  client: LitNodeClient,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  router: NextRouter,
  dispatch: Dispatch<AnyAction>,
  authClient: LitAuthClient
) => {
  const hasRedirectedRef = useRef<boolean>(false);
  const hasFetchedMintedRef = useRef<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const fulfillmentDetails = useSelector(
    (state: RootState) => state.app.fulfillmentDetailsReducer.value
  );
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const connectedPKP = useSelector(
    (state: RootState) => state.app.currentPKPReducer.value
  );

  const loginWithWeb2Auth = async () => {
    try {
      const provider = authClient.initProvider(ProviderType.Google, {
        redirectUri: `${REDIRECT_URL}${router.asPath}`,
      });

      setFulfillmentDetailsLocalStorage(JSON.stringify(fulfillmentDetails));
      setCartItemsLocalStorage(JSON.stringify(cartItems));

      await (provider as any).signIn();
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

  const storeAuthOnChain = async (authSig: any, currentPKP: any) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
        137
      );

      const tx = await createTxData(
        provider,
        CoinOpPKPsABI,
        COIN_OP_PKPS,
        "createUserPKPAccount",
        [BigInt(currentPKP?.tokenId.hex!).toString()]
      );

      await litExecute(
        client,
        provider,

        tx,
        "createUserPKPAccount",
        authSig
      );
    } catch (err: any) {
      console.error(err.message);
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
      const provider = authClient.initProvider(ProviderType.Google, {
        redirectUri: `${REDIRECT_URL}${router.asPath}`,
      });

      const authMethod = await provider.authenticate();

      const values = await handlePKPs(provider, authMethod);

      dispatch(
        setLogin({
          actionOpen: false,
          actionHighlight: undefined,
        })
      );
      setLoginLoading(false);
      setLitLoginLocalStorage(
        JSON.stringify({
          ...values?.currentPKP,
          sessionSig: values?.sessionSigs,
          pkpWallet: values?.pkpWallet,
          authSig: values?.authSig,
          encryptedToken: values?.encryptedToken,
        })
      );
      dispatch(
        setCurrentPKP({
          ...values?.currentPKP,
          sessionSig: values?.sessionSigs,
          pkpWallet: values?.pkpWallet,
          authSig: values?.authSig,
          encryptedToken: values?.encryptedToken,
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
    try {
      let res = await fetchPkp(provider, authMethod);
      if (res == undefined) {
        res = await mintPkp(provider, authMethod);
      }
      const sessionSigs = await getSessionSig(
        authMethod,
        res,
        provider,
        client
      );
      const pkpWallet = new PKPEthersWallet({
        controllerSessionSigs: sessionSigs,
        pkpPubKey: res.publicKey,
        rpc: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      });
      const authSig = await generateAuthSignature(pkpWallet);

      let doesExist: boolean = false;

      try {
        doesExist = (await publicClient.readContract({
          address: COIN_OP_PKPS,
          abi: CoinOpPKPsABI,
          functionName: "userExists",
          args: [BigInt(res?.tokenId.hex!).toString()],
        })) as boolean;
      } catch (err: any) {
        doesExist = false;
      }

      if (!doesExist) {
        await storeAuthOnChain(authSig, res);
      }

      const encryptedToken = await encryptToken(
        client,
        res.ethAddress,
        authSig,
        BigInt(res.tokenId.hex).toString()
      );

      return {
        currentPKP: res,
        encryptedToken,
        authSig,
        pkpWallet,
        sessionSigs,
      };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const mintPkp = async (provider: any, authMethod: any) => {
    if (provider && authMethod && !hasFetchedMintedRef.current) {
      hasFetchedMintedRef.current = true;
      const mintRes = await provider.mintPKPThroughRelayer(authMethod);
      const transaction = await publicClient.getTransaction({
        hash: mintRes,
      });
      const filter = await publicClient.createContractEventFilter({
        abi: PKPAbi,
        address: "0x8F75a53F65e31DD0D2e40d0827becAaE2299D111",
        eventName: "Transfer",
        fromBlock: transaction.blockNumber as bigint,
        toBlock: transaction.blockNumber as bigint,
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

  useEffect(() => {
    if (
      isSignInRedirect(`${REDIRECT_URL}${router.asPath}`) &&
      !hasRedirectedRef.current
    ) {
      hasRedirectedRef.current = true;
      handleRedirect();
    }
  }, [handleRedirect]);

  useEffect(() => {
    dispatch(setQuestInfo(undefined));
  }, [address, connectedPKP]);

  return {
    loginWithWeb2Auth,
    loginLoading,
  };
};

export default useLogin;

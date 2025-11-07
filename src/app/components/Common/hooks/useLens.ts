import { evmAddress } from "@lens-protocol/client";
import {
  fetchAccountsAvailable,
  revokeAuthentication,
} from "@lens-protocol/client/actions";
import { useContext, useEffect, useState } from "react";
import { createWalletClient, custom } from "viem";
import { chains } from "@lens-chain/sdk/viem";
import { ModalContext, ScrollContext } from "@/app/providers";
import { getOracleData } from "../../../../../graphql/queries/getOracleData";

const useLens = (
  isConnected: boolean,
  address: `0x${string}` | undefined,
  dict: any
) => {
  const contexto = useContext(ModalContext);
  const scrollContext = useContext(ScrollContext);
  const [lensCargando, setLensCargando] = useState<boolean>(false);
  const [cartAnim, setCartAnim] = useState<boolean>(false);

  const resumeLensSession = async () => {
    try {
      const resumed = await contexto?.clienteLens?.resumeSession();

      if (resumed?.isOk()) {
        const accounts = await fetchAccountsAvailable(contexto?.clienteLens!, {
          managedBy: evmAddress(address!),
          includeOwned: true,
        });

        if (accounts.isErr()) {
          return;
        }

        contexto?.setLensConectado?.({
          ...contexto?.lensConectado,

          profile: accounts.value.items?.[0]?.account,
          sessionClient: resumed?.value,
        });
      }
    } catch (err) {
      console.error("Error al reanudar la sesión:", err);
      return null;
    }
  };

  useEffect(() => {
    if (address && contexto?.clienteLens && !contexto?.lensConectado?.profile) {
      resumeLensSession();
    }
  }, [address, contexto?.clienteLens]);

  const handleConectarse = async () => {
    if (!address || !contexto?.clienteLens) return;
    setLensCargando(true);
    try {
      const signer = createWalletClient({
        chain: chains.mainnet,
        transport: custom(window.ethereum!),
        account: address,
      });
      const accounts = await fetchAccountsAvailable(contexto?.clienteLens, {
        managedBy: evmAddress(signer.account.address),
        includeOwned: true,
      });

      if (accounts.isErr()) {
        setLensCargando(false);
        return;
      }
      if (accounts.value.items?.[0]?.account?.address) {
        const authenticated = await contexto?.clienteLens?.login({
          accountOwner: {
            account: evmAddress(accounts.value.items?.[0]?.account?.address),
            owner: signer.account?.address?.toLowerCase(),
          },
          signMessage: (message) => signer.signMessage({ message }),
        });

        if (authenticated.isErr()) {
          console.error(authenticated.error);
          contexto?.setError?.(dict?.Common.auth);
          setLensCargando(false);
          return;
        }

        const sessionClient = authenticated.value;

        contexto?.setLensConectado?.({
          sessionClient,
          profile: accounts.value.items?.[0]?.account,
        });
      } else {
        const authenticatedOnboarding = await contexto?.clienteLens.login({
          onboardingUser: {
            wallet: signer.account.address,
          },
          signMessage: (message) => signer.signMessage({ message }),
        });

        if (authenticatedOnboarding.isErr()) {
          console.error(authenticatedOnboarding.error);
          contexto?.setError?.(dict?.Common.onboard);

          setLensCargando(false);
          return;
        }

        const sessionClient = authenticatedOnboarding.value;

        contexto?.setLensConectado?.({
          sessionClient,
        });

        contexto?.setCrearCuenta?.(true);
        contexto?.setConnect?.(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setLensCargando(false);
  };

  const salir = async () => {
    setLensCargando(true);
    try {
      const auth =
        await contexto?.lensConectado?.sessionClient?.getAuthenticatedUser();

      if (auth?.isOk()) {
        await revokeAuthentication(contexto?.lensConectado?.sessionClient!, {
          authenticationId: auth.value?.authenticationId,
        });

        contexto?.setLensConectado?.(undefined);
        window.localStorage.removeItem("lens.mainnet.credentials");
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setLensCargando(false);
  };

  useEffect(() => {
    if (
      !isConnected &&
      contexto?.lensConectado?.profile &&
      contexto?.clienteLens
    ) {
      salir();
    }
  }, [isConnected]);

  const scrollToCheckOut = () => {
    if (!scrollContext?.scrollRef || !scrollContext?.scrollRef?.current) return;

    scrollContext?.scrollRef?.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setTimeout(() => {
      scrollContext!.scrollRef.current!.scrollTop =
        scrollContext?.scrollRef.current!.scrollHeight;
    }, 500);
  };

  const handleOracles = async (): Promise<void> => {
    try {
      const data = await getOracleData();

      contexto?.setOracleData(data?.data?.currencyAddeds);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (!contexto?.oracleData || contexto?.oracleData?.length < 1) {
      handleOracles();
    }
  }, []);

  useEffect(() => {
    if (cartAnim) {
      setTimeout(() => {
        setCartAnim(false);
      }, 2000);
    }
  }, [cartAnim]);

  useEffect(() => {
    if (Number(contexto?.cartItems?.length) > 0) {
      setCartAnim(true);
    }
  }, [contexto?.cartItems?.length]);

  return {
    cartAnim,
    lensCargando,
    salir,
    handleConectarse,
    scrollToCheckOut,
  };
};

export default useLens;

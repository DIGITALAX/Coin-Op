import { useContext, useState } from "react";
import { Account, evmAddress } from "@lens-protocol/client";
import { createWalletClient, custom } from "viem";
import { chains } from "@lens-chain/sdk/viem";
import {
  createAccountWithUsername,
  fetchAccount,
} from "@lens-protocol/client/actions";
import { v4 as uuidv4 } from "uuid";
import { immutable } from "@lens-chain/storage-client";
import pollResult from "@/app/lib/helpers/pollResult";
import { ModalContext } from "@/app/providers";
import { useAccount } from "wagmi";

const useCrearCuenta = (dict: any) => {
  const { address } = useAccount();
  const context = useContext(ModalContext);
  const [account, setAccount] = useState<{
    localname: string;
    bio: string;
    username: string;
    pfp?: Blob;
  }>({
    localname: "",
    bio: "",
    username: "",
  });
  const [accountLoading, setAccountLoading] = useState<boolean>(false);

  const handleCreateAccount = async () => {
    if (!address || !context?.lensConectado?.sessionClient) return;
    setAccountLoading(true);
    try {
      const signer = createWalletClient({
        chain: chains.mainnet,
        transport: custom(window.ethereum!),
        account: address,
      });

      let picture = undefined;
      const acl = immutable(chains.mainnet.id);
      if (account?.pfp) {
        const res = await fetch("/api/ipfs", {
          method: "POST",
          body: account?.pfp,
        });
        const json = await res.json();

        picture = "ipfs://" + json?.cid;
      }

      const { uri } = await context?.clienteAlmacenamiento!?.uploadAsJson(
        {
          $schema: "https://json-schemas.lens.dev/account/1.0.0.json",
          lens: {
            id: uuidv4(),
            name: account?.localname,
            bio: account?.bio,
            picture,
          },
        },
        { acl }
      );

      const accountResponse = await createAccountWithUsername(
        context?.lensConectado?.sessionClient,
        {
          accountManager: [evmAddress(signer.account.address)],
          username: {
            localName: account?.username,
          },
          metadataUri: uri,
        }
      );

      if (accountResponse.isErr()) {
        setAccountLoading(false);
        context?.setError(dict?.Common?.error);
        return;
      }

      if (
        (accountResponse.value as any)?.message?.includes(
          "username already exists"
        )
      ) {
        context?.setError(dict?.Common?.user);
        setAccountLoading(false);
        return;
      }

      if ((accountResponse.value as any)?.hash) {
        const res = await pollResult(
          (accountResponse.value as any)?.hash,
          context?.lensConectado?.sessionClient
        );

        if (res) {
          const newAcc = await fetchAccount(
            context?.lensConectado?.sessionClient,
            {
              username: {
                localName: account?.username,
              },
            }
          );

          if (newAcc.isErr()) {
            setAccountLoading(false);
            return;
          }

          if (newAcc.value?.address) {
            const ownerSigner =
              await context?.lensConectado?.sessionClient?.switchAccount({
                account: newAcc.value?.address,
              });

            if (ownerSigner?.isOk()) {
              context?.setLensConectado?.((prev) => ({
                ...prev,
                profile: newAcc.value as Account,
                sessionClient: ownerSigner?.value,
              }));
              context?.setCrearCuenta(false);
              setAccount({
                localname: "",
                bio: "",
                username: "",
              });
            }
          } else {
            console.error(accountResponse);
            context?.setError(dict?.Common?.error);
            setAccountLoading(false);
            return;
          }
        } else {
          console.error(accountResponse);
          context?.setError(dict?.Common?.error);
          setAccountLoading(false);
          return;
        }
      } else {
        console.error(accountResponse);
        context?.setError(dict?.Common?.error);

        setAccountLoading(false);
        return;
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setAccountLoading(false);
  };

  return {
    account,
    setAccount,
    accountLoading,
    handleCreateAccount,
  };
};

export default useCrearCuenta;

import { useContext, useEffect, useState } from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { LIT_NETWORK } from "@lit-protocol/constants";
import {
  LitNodeClient,
  checkAndSignAuthMessage,
  uint8arrayFromString,
} from "@lit-protocol/lit-node-client";
import { CartItem } from "../../Prerolls/types/prerolls.types";
import {
  ASSETS,
  COIN_OP_OPEN_ACTION,
  DIGITALAX_ADDRESS,
} from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { chains } from "@lens-chain/sdk/viem";
import { useRouter } from "next/navigation";
import { Details } from "../types/walkthrough.types";
import { removeCartItemsLocalStorage } from "@/app/lib/utils";
import findBalance from "@/app/lib/helpers/findBalance";
import { executePostAction } from "@lens-protocol/client/actions";
import { blockchainData } from "@lens-protocol/client";
import { ethers } from "ethers";
import { Indexar } from "../../Common/types/common.types";
import pollResult from "@/app/lib/helpers/pollResult";
import { AccessControlConditions } from "@lit-protocol/types";

const useCheckout = (dict: any, address: `0x${string}` | undefined) => {
  const publicClient = createPublicClient({
    chain: chains.mainnet,
    transport: http("https://rpc.lens.xyz"),
  });
  const client = new LitNodeClient({
    litNetwork: LIT_NETWORK.Datil,
    debug: false,
  });
  const coder = new ethers.AbiCoder();
  const context = useContext(ModalContext);
  const router = useRouter();
  const [startIndex, setStartIndex] = useState<number>(0);
  const [chooseCartItem, setChooseCartItem] = useState<CartItem | undefined>(
    context?.cartItems?.[0]!
  );
  const [fulfillmentDetails, setFulfillmentDetails] = useState<Details>({
    address: "",
    zip: "",
    city: "",
    state: "",
    country: "",
  });

  const [encrypted, setEncrypted] = useState<
    { postId: string; data: string }[] | undefined
  >();
  const [isApprovedSpend, setApprovedSpend] = useState<boolean>(false);
  const [checkoutCurrency, setCheckoutCurrency] = useState<string>(
    ASSETS?.[0]?.contract?.address?.toLowerCase()
  );
  const [openCountryDropdown, setOpenCountryDropdown] =
    useState<boolean>(false);
  const [collectPostLoading, setCollectPostLoading] = useState<boolean>(false);

  const encryptFulfillment = async () => {
    if (
      !address ||
      fulfillmentDetails?.address?.trim() === "" ||
      fulfillmentDetails?.city?.trim() === "" ||
      fulfillmentDetails?.state?.trim() === "" ||
      fulfillmentDetails?.zip?.trim() === "" ||
      fulfillmentDetails?.country?.trim() === ""
    )
      return;
    setCollectPostLoading(true);
    try {
      let nonce = await client.getLatestBlockhash();
      await checkAndSignAuthMessage({
        chain: "polygon",
        nonce: nonce!,
      });
      await client.connect();

      let encryptedItems: {
        postId: string;
        data: string;
      }[] = [];

      let groupedItems: {
        [key: string]: {
          color: string;
          size: string;
          amount: number;
          collectionId: number;
        };
      } = {};

      context?.cartItems?.forEach((item: CartItem) => {
        const pubId = item?.item?.postId;
        if (!groupedItems[pubId]) {
          groupedItems[pubId] = {
            color: "",
            size: "",
            amount: 0,
            collectionId: 0,
          };
        }

        groupedItems[pubId].color = item?.chosenColor;
        groupedItems[pubId].size = item?.chosenSize;
        groupedItems[pubId].amount = item?.chosenAmount;
        groupedItems[pubId].collectionId = Number(item?.item?.collectionId);
      });

      const accessControlConditions = [
        {
          contractAddress: "",
          standardContractType: "",
          chain: "polygon",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: address.toLowerCase(),
          },
        },
        {
          operator: "or",
        },
        {
          contractAddress: "",
          standardContractType: "",
          chain: "polygon",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: address?.toLowerCase() as string,
          },
        },
      ] as AccessControlConditions;

      for (const [postId, item] of Object.entries(groupedItems)) {
        const { ciphertext, dataToEncryptHash } = await client.encrypt({
          accessControlConditions,
          dataToEncrypt: uint8arrayFromString(
            JSON.stringify({
              ...fulfillmentDetails,
              ...item,
              origin: "1",
              fulfillerAddress: [DIGITALAX_ADDRESS],
            })
          ),
        });

        encryptedItems.push({
          postId,
          data: JSON.stringify({
            ciphertext,
            dataToEncryptHash,
            accessControlConditions,
            chain: "polygon",
          }),
        });
      }

      encryptedItems && setEncrypted(encryptedItems);
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectPostLoading(false);
  };

  const collectItem = async () => {
    if (!encrypted || !context?.lensConectado?.sessionClient) return;

    setCollectPostLoading(true);
    try {
      const balance = await findBalance(
        publicClient,
        checkoutCurrency,
        address as `0x${string}`
      );

      if (
        Number(balance) <
        (Number(
          (context?.cartItems || [])?.reduce(
            (accumulator, currentItem) =>
              accumulator +
              Number(currentItem?.item?.price) * currentItem.chosenAmount,
            0
          ) *
            10 ** 18
        ) /
          Number(
            context?.oracleData?.find(
              (oracle) =>
                oracle.currency?.toLowerCase() ===
                checkoutCurrency?.toLowerCase()
            )?.rate
          )) *
          Number(
            context?.oracleData?.find(
              (oracle) =>
                oracle.currency?.toLowerCase() ===
                checkoutCurrency?.toLowerCase()
            )?.wei
          )
      ) {
        context?.setModalOpen(dict?.Common?.pocket);

        setCollectPostLoading(false);
        return;
      }

      let encryptedFulfillmentUploaded: string[] = [];

      const orderedEncrypted = context?.cartItems.map((item) => {
        const match = encrypted?.find((e) => e?.postId === item?.item?.postId);
        return match;
      });

      await Promise.all(
        orderedEncrypted?.map(async (encrypt) => {
          const ipfsRes = await fetch("/api/ipfs", {
            method: "POST",
            headers: {
              contentType: "application/json",
            },
            body: encrypt?.data,
          });
          const json = await ipfsRes.json();
          encryptedFulfillmentUploaded.push("ipfs://" + json?.cid);
        })
      );

      const res = await executePostAction(
        context?.lensConectado?.sessionClient,
        {
          post: context?.cartItems?.[0]?.item?.postId,
          action: {
            unknown: {
              address: COIN_OP_OPEN_ACTION,
              params: [
                {
                  key: ethers.keccak256(
                    ethers.toUtf8Bytes("lens.param.buyCoinop")
                  ),
                  data: blockchainData(
                    coder.encode(
                      ["string[]", "address[]", "uint256[]", "uint8[]"],
                      [
                        encryptedFulfillmentUploaded,
                        Array.from({ length: context?.cartItems?.length }, () =>
                          Number(checkoutCurrency)
                        ),
                        context?.cartItems?.map((item) =>
                          Number(item?.item?.collectionId)
                        ),
                        context?.cartItems?.map((item) => item?.chosenAmount),
                      ]
                    )
                  ),
                },
              ],
            },
          },
        }
      );

      if (res.isErr()) {
        context?.setError?.(dict.Common.error);
        setCollectPostLoading(false);
        return;
      }

      if ((res.value as any)?.reason?.includes("Signless")) {
        context?.setSignless?.(true);
      } else if ((res.value as any)?.raw) {
        context?.setIndexar(dict?.collect?.indexCol);
        const provider = new ethers.BrowserProvider(window.ethereum);

        const signer = await provider.getSigner();

        const tx = {
          chainId: (res.value as any)?.raw?.chainId,
          from: (res.value as any)?.raw?.from,
          to: (res.value as any)?.raw?.to,
          nonce: (res.value as any)?.raw?.nonce,
          gasLimit: (res.value as any)?.raw?.gasLimit,
          maxFeePerGas: (res.value as any)?.raw?.maxFeePerGas,
          maxPriorityFeePerGas: (res.value as any)?.raw?.maxPriorityFeePerGas,
          value: (res.value as any)?.raw?.value,
          data: (res.value as any)?.raw?.data,
        };
        const txResponse = await signer.sendTransaction(tx);
        await txResponse.wait();

        context?.setCartItems([]);
        removeCartItemsLocalStorage();
        setEncrypted(undefined);
        setFulfillmentDetails({
          address: "",
          zip: "",
          city: "",
          state: "",
          country: "",
        });

        context?.setModalOpen(dict?.Common.allYours);

        router.push(
          `https://cypher.digitalax.xyz/autograph/${
            context?.lensConectado?.profile?.username?.localName?.split(
              "@"
            )?.[1]
          }`
        );

        context?.setIndexar(Indexar.Exito);
      } else if ((res.value as any)?.hash) {
        context?.setIndexar(Indexar.Indexando);
        if (
          await pollResult(
            (res.value as any)?.hash,
            context?.lensConectado?.sessionClient!
          )
        ) {
          context?.setCartItems([]);
          removeCartItemsLocalStorage();
          setEncrypted(undefined);
          setFulfillmentDetails({
            address: "",
            zip: "",
            city: "",
            state: "",
            country: "",
          });

          context?.setModalOpen(dict?.Common.allYours);

          router.push(
            `https://cypher.digitalax.xyz/autograph/${
              context?.lensConectado?.profile?.username?.localName?.split(
                "@"
              )?.[1]
            }`
          );

          context?.setIndexar(Indexar.Exito);
        } else {
          context?.setError?.(dict.Common.error);
        }
      } else {
        context?.setError?.(dict.Common.error);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setTimeout(() => {
      context?.setIndexar(Indexar.Inactivo);
    }, 3000);
    setCollectPostLoading(false);
  };

  const approveSpend = async () => {
    setCollectPostLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: chains.mainnet,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: checkoutCurrency as `0x${string}`,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "tokens",
                type: "uint256",
              },
            ],
            name: "approve",
            outputs: [{ internalType: "bool", name: "success", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "approve",
        chain: chains.mainnet,
        args: [
          COIN_OP_OPEN_ACTION,
          ((Number(
            (context?.cartItems || [])?.reduce(
              (accumulator, currentItem) =>
                accumulator +
                Number(currentItem?.item?.price) * currentItem.chosenAmount,
              0
            ) *
              10 ** 18
          ) /
            Number(
              context?.oracleData?.find(
                (oracle) =>
                  oracle.currency?.toLowerCase() ===
                  checkoutCurrency?.toLowerCase()
              )?.rate
            )) *
            Number(
              context?.oracleData?.find(
                (oracle) =>
                  oracle.currency?.toLowerCase() ===
                  checkoutCurrency?.toLowerCase()
              )?.wei
            ) *
            1.3) as any,
        ],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      setApprovedSpend(true);
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectPostLoading(false);
  };

  const checkApproved = async () => {
    try {
      const data = await publicClient.readContract({
        address: checkoutCurrency?.toLowerCase() as `0x${string}`,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "address",
                name: "spender",
                type: "address",
              },
            ],
            name: "allowance",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "allowance",
        args: [address as `0x${string}`, COIN_OP_OPEN_ACTION],
      });

      if (address) {
        if (
          Number((data as any)?.toString()) /
          ((Number(
            (context?.cartItems || [])?.reduce(
              (accumulator, currentItem) =>
                accumulator +
                Number(currentItem?.item?.price) * currentItem.chosenAmount,
              0
            ) *
              10 ** 18
          ) /
            Number(
              context?.oracleData?.find(
                (oracle) =>
                  oracle.currency?.toLowerCase() ===
                  checkoutCurrency?.toLowerCase()
              )?.rate
            )) *
            Number(
              context?.oracleData?.find(
                (oracle) =>
                  oracle.currency?.toLowerCase() ===
                  checkoutCurrency?.toLowerCase()
              )?.wei
            ))
        ) {
          setApprovedSpend(true);
        } else {
          setApprovedSpend(false);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (context?.lensConectado?.profile) {
      checkApproved();
    }
  }, [checkoutCurrency, context?.lensConectado?.profile]);

  useEffect(() => {
    if (Number(context?.cartItems?.length) > 0 && !chooseCartItem) {
      setChooseCartItem(context?.cartItems?.[0]!);
    }
  }, [context?.cartItems]);

  return {
    encryptFulfillment,
    collectPostLoading,
    collectItem,
    fulfillmentDetails,
    setFulfillmentDetails,
    checkoutCurrency,
    setCheckoutCurrency,
    openCountryDropdown,
    setOpenCountryDropdown,
    approveSpend,
    isApprovedSpend,
    startIndex,
    setStartIndex,
    encrypted,
    setEncrypted,
    chooseCartItem,
    setChooseCartItem,
  };
};

export default useCheckout;

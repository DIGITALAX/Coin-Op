import { useContext, useEffect, useState } from "react";
import FGOMarketABI from "@/app/abis/parent/FGOMarket.json";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { CartItem } from "../../Prerolls/types/prerolls.types";
import { CartItemMarket } from "../../AppMarket/types/appmarket.types";
import {
  ASSETS,
  COIN_OP_MARKET,
  COIN_OP_OPEN_ACTION,
  DIGITALAX_ADDRESS,
  DIGITALAX_PUBLIC_KEY,
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
import {
  encryptForMultipleRecipients,
  getPublicKeyFromSignature,
} from "@/app/lib/helpers/encryption";
import { ensurePurchasable } from "@/app/lib/helpers/canPurchase";

const useCheckout = (dict: any, address: `0x${string}` | undefined) => {
  const publicClient = createPublicClient({
    chain: chains.testnet,
    transport: http("https://rpc.testnet.lens.dev"),
  });
  const coder = new ethers.AbiCoder();
  const context = useContext(ModalContext);
  const router = useRouter();
  const [startIndex, setStartIndex] = useState<{
    prerolls: number;
    market: number;
  }>({
    prerolls: 0,
    market: 0,
  });
  const [chooseCartItem, setChooseCartItem] = useState<{
    prerolls: CartItem | undefined;
    market: CartItemMarket | undefined;
  }>({
    prerolls: context?.cartItems?.[0]!,
    market: context?.cartItemsMarket?.[0]!,
  });

  const [isApprovedSpend, setApprovedSpend] = useState<{
    prerolls: boolean;
    market: boolean;
  }>({
    prerolls: false,
    market: false,
  });
  const [checkoutCurrency, setCheckoutCurrency] = useState<string>(
    ASSETS?.[0]?.contract?.address?.toLowerCase()
  );
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [fulfillmentDetails, setFulfillmentDetails] = useState<Details>({
    address: "",
    zip: "",
    city: "",
    state: "",
    country: "",
  });
  const [openCountryDropdown, setOpenCountryDropdown] =
    useState<boolean>(false);

  const encryptFulfillment = async () => {
    if (
      !address ||
      !DIGITALAX_PUBLIC_KEY ||
      fulfillmentDetails?.address?.trim() === "" ||
      fulfillmentDetails?.city?.trim() === "" ||
      fulfillmentDetails?.state?.trim() === "" ||
      fulfillmentDetails?.zip?.trim() === "" ||
      fulfillmentDetails?.country?.trim() === ""
    )
      return;
    setCheckoutLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: chains.testnet,
        transport: custom((window as any).ethereum),
      });

      const message = "Sign this message to encrypt your fulfillment details";
      const signature = await clientWallet.signMessage({
        account: address,
        message,
      });

      const buyerPublicKey = await getPublicKeyFromSignature(
        message,
        signature
      );
      const prerolls = context?.purchaseMode == "prerolls" ? true : false;

      let encryptedItems: (string | null)[] = [];
      let items = prerolls ? context?.cartItems : context?.cartItemsMarket;

      await Promise.all(
        (items || [])?.map(async (item, index) => {
          const fulfillmentData = prerolls
            ? {
                ...fulfillmentDetails,
                size: (item as CartItem)?.chosenSize.toUpperCase(),
                color: (item as CartItem)?.chosenColor,
                index: (item as CartItem)?.chosenIndex,
                origin: "1",
                fulfillerAddress: DIGITALAX_ADDRESS,
              }
            : {
                ...fulfillmentDetails,
                size: item?.item?.chosenSize.toUpperCase(),
                fulfillerAddress: DIGITALAX_ADDRESS,
              };

          const encryptedData = await encryptForMultipleRecipients(
            fulfillmentData,
            [
              { address, publicKey: buyerPublicKey },
              { address: DIGITALAX_ADDRESS, publicKey: DIGITALAX_PUBLIC_KEY },
            ]
          );

          const ipfsRes = await fetch("/api/ipfs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(encryptedData),
          });
          const json = await ipfsRes.json();

          encryptedItems[index] = "ipfs://" + json?.cid;
        })
      );
      return encryptedItems;
    } catch (err: any) {
      console.error(err.message);
    }
    setCheckoutLoading(false);
  };

  const buyMarketItems = async () => {
    if (!address) return;
    setCheckoutLoading(true);

    if (
      !(await ensurePurchasable(context?.cartItemsMarket || [], publicClient))
    ) {
      context?.setError?.(dict?.Common.error);
      setCheckoutLoading(false);
      return;
    }

    const encrypted = await encryptFulfillment();

    if (!encrypted) {
      context?.setError?.(dict?.Common.error);
      setCheckoutLoading(false);
      return;
    }

    try {
      const clientWallet = createWalletClient({
        chain: chains.testnet,
        transport: custom((window as any).ethereum),
      });

      const params = (context?.cartItemsMarket || [])?.map((item, index) => ({
        parentId: BigInt(item?.item?.designId || "0"),
        parentAmount: BigInt(item.chosenAmount),
        childId: BigInt(0),
        childAmount: BigInt(0),
        templateId: BigInt(0),
        templateAmount: BigInt(0),
        parentContract: item?.item?.parentContract as `0x${string}`,
        childContract:
          "0x0000000000000000000000000000000000000000" as `0x${string}`,
        templateContract:
          "0x0000000000000000000000000000000000000000" as `0x${string}`,
        isPhysical: true,
        fulfillmentData: encrypted[index] || "",
      }));
      const { request } = await publicClient.simulateContract({
        address: COIN_OP_MARKET,
        abi: FGOMarketABI,
        functionName: "buy",
        chain: chains.testnet,
        args: [params],
        account: address,
      });

      const hash = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash });

      context?.setCartItemsMarket([]);
      setFulfillmentDetails({
        address: "",
        zip: "",
        city: "",
        state: "",
        country: "",
      });

      context?.setModalOpen(dict?.Common.allYours);
      context?.setCartItemsMarket([]);
      router.push(`/account`);
    } catch (err: any) {
      console.error(err.message);
      context?.setError?.(dict?.Common.error);
    }
    setCheckoutLoading(false);
  };

  const collectItem = async () => {
    if (!context?.lensConectado?.sessionClient) return;
    setCheckoutLoading(true);
    const encrypted = await encryptFulfillment();

    if (!encrypted) {
      context?.setError?.(dict?.Common.error);
      setCheckoutLoading(false);
      return;
    }

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

        setCheckoutLoading(false);
        return;
      }

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
                        encrypted,
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
        context?.setError?.(dict?.Common.error);
        setCheckoutLoading(false);
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
          context?.setError?.(dict?.Common.error);
        }
      } else {
        context?.setError?.(dict?.Common.error);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setTimeout(() => {
      context?.setIndexar(Indexar.Inactivo);
    }, 3000);
    setCheckoutLoading(false);
  };

  const approveSpend = async () => {
    setCheckoutLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: chains.testnet,
        transport: custom((window as any).ethereum),
      });

      const prerolls = context?.purchaseMode == "prerolls" ? true : false;
      const currency = (
        prerolls
          ? checkoutCurrency
          : chooseCartItem?.market?.item?.infraCurrency
      ) as `0x${string}`;

      if (!currency) return;
      const { request } = await publicClient.simulateContract({
        address: currency,
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
        chain: chains.testnet,
        args: prerolls
          ? [
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
            ]
          : [
              COIN_OP_MARKET,
              (context?.cartItemsMarket || [])?.reduce(
                (acc, item) =>
                  acc +
                  (Number(item?.item?.totalPhysicalPrice) / 10 ** 18) *
                    item.chosenAmount,
                0
              ) *
                10 ** 18 *
                1.3,
            ],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      setApprovedSpend((prev) => ({
        ...prev,
        [prerolls ? "prerolls" : "market"]: true,
      }));
    } catch (err: any) {
      console.error(err.message);
    }
    setCheckoutLoading(false);
  };

  const checkApproved = async () => {
    try {
      const prerolls = context?.purchaseMode == "prerolls" ? true : false;
      const currency = (
        prerolls
          ? checkoutCurrency
          : chooseCartItem?.market?.item?.infraCurrency
      ) as `0x${string}`;

      if (!currency) return;

      const data = await publicClient.readContract({
        address: currency,
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
        args: [
          address as `0x${string}`,
          prerolls ? COIN_OP_OPEN_ACTION : COIN_OP_MARKET,
        ],
      });

      if (address) {
        if (prerolls) {
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
            setApprovedSpend((prev) => ({
              ...prev,
              prerolls: true,
            }));
          } else {
            setApprovedSpend((prev) => ({
              ...prev,
              prerolls: false,
            }));
          }
        } else {
          if (
            Number((data as any)?.toString()) >=
            (context?.cartItemsMarket || [])?.reduce(
              (acc, item) =>
                acc +
                (Number(item?.item?.totalPhysicalPrice) / 10 ** 18) *
                  item.chosenAmount,
              0
            ) *
              10 ** 18
          ) {
            setApprovedSpend((prev) => ({
              ...prev,
              market: true,
            }));
          } else {
            setApprovedSpend((prev) => ({
              ...prev,
              market: false,
            }));
          }
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      context?.lensConectado?.profile &&
      context?.purchaseMode == "prerolls" &&
      Number(context?.cartItems?.length) > 0
    ) {
      checkApproved();
    }
    if (
      address &&
      context?.purchaseMode == "appMarket" &&
      Number(context?.cartItemsMarket?.length) > 0
    ) {
      checkApproved();
    }
  }, [
    checkoutCurrency,
    context?.cartItems,
    context?.cartItemsMarket,
    context?.lensConectado?.profile,
    address,
    context?.purchaseMode,
  ]);

  useEffect(() => {
    if (
      Number(context?.cartItems?.length) > 0 &&
      !chooseCartItem &&
      context?.purchaseMode == "prerolls"
    ) {
      setChooseCartItem((prev) => ({
        ...prev,
        prerolls: context?.cartItems?.[0]!,
      }));
    }

    if (
      Number(context?.cartItems?.length) > 0 &&
      !chooseCartItem &&
      context?.purchaseMode == "appMarket"
    ) {
      setChooseCartItem((prev) => ({
        ...prev,
        market: context?.cartItemsMarket?.[0]!,
      }));
    }
  }, [context?.cartItemsMarket, context?.cartItems, context?.purchaseMode]);

  useEffect(() => {
    if (
      context?.purchaseMode === "appMarket" &&
      Number(context?.cartItemsMarket?.length) > 0
    ) {
      setChooseCartItem((prev) => ({
        ...prev,
        market: context?.cartItemsMarket?.[0]!,
      }));
      setStartIndex((prev) => ({
        ...prev,
        market: 0,
      }));
    } else if (
      context?.purchaseMode === "prerolls" &&
      Number(context?.cartItems?.length) > 0
    ) {
      setChooseCartItem((prev) => ({
        ...prev,
        prerolls: context?.cartItems?.[0]!,
      }));
      setStartIndex((prev) => ({
        ...prev,
        prerolls: 0,
      }));
    }
  }, [context?.purchaseMode]);

  return {
    checkoutLoading,
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
    chooseCartItem,
    setChooseCartItem,
    buyMarketItems,
  };
};

export default useCheckout;

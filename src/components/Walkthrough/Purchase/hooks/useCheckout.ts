import {
  CartItem,
  Details,
  OracleData,
} from "@/components/Common/types/common.types";
import { useEffect, useState } from "react";
import { AnyAction, Dispatch } from "redux";
import { NextRouter } from "next/router";
import { PublicClient, createWalletClient, custom } from "viem";
import {
  LitNodeClient,
  checkAndSignAuthMessage,
} from "@lit-protocol/lit-node-client";
import {
  ACCEPTED_TOKENS,
  COIN_OP_OPEN_ACTION,
} from "../../../../../lib/constants";
import { Profile } from "@/components/Common/types/generated";
import { encryptItems } from "../../../../../lib/subgraph/helpers/encryptItems";
import findBalance from "../../../../../lib/subgraph/helpers/findBalance";
import { polygon } from "viem/chains";
import encodeActData from "../../../../../lib/subgraph/helpers/encodeActData";
import toHexWithLeadingZero from "../../../../../lib/lens/helpers/leadingZero";
import {
  removeCartItemsLocalStorage,
  setCartItemsLocalStorage,
} from "../../../../../lib/subgraph/utils";
import { setCart } from "../../../../../redux/reducers/cartSlice";
import actPost from "../../../../../lib/lens/helpers/actPost";
import { setInsufficientBalance } from "../../../../../redux/reducers/insufficientBalanceSlice";
import { setModalOpen } from "../../../../../redux/reducers/modalOpenSlice";

const useCheckout = (
  publicClient: PublicClient,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}` | undefined,
  lensConnected: Profile | undefined,
  client: LitNodeClient,
  oracleData: OracleData[],
  cartItems: CartItem[],
  router: NextRouter
) => {
  const [startIndex, setStartIndex] = useState<number>(0);
  const [fulfillmentDetails, setFulfillmentDetails] = useState<Details>({
    name: "",
    contact: "",
    address: "",
    zip: "",
    city: "",
    state: "",
    country: "",
  });
  const [encrypted, setEncrypted] = useState<
    | {
        pubId: string;
        data: string;
      }[]
    | undefined
  >();
  const [chooseCartItem, setChooseCartItem] = useState<CartItem>();
  const [isApprovedSpend, setApprovedSpend] = useState<boolean>(false);
  const [checkoutCurrency, setCheckoutCurrency] = useState<string>(
    ACCEPTED_TOKENS[1][2]?.toLowerCase()
  );
  const [openCountryDropdown, setOpenCountryDropdown] =
    useState<boolean>(false);
  const [collectPostLoading, setCollectPostLoading] = useState<boolean>(false);

  const encryptFulfillment = async () => {
    if (
      !address ||
      fulfillmentDetails?.address?.trim() === "" ||
      fulfillmentDetails?.city?.trim() === "" ||
      fulfillmentDetails?.name?.trim() === "" ||
      fulfillmentDetails?.state?.trim() === "" ||
      fulfillmentDetails?.zip?.trim() === "" ||
      fulfillmentDetails?.country?.trim() === ""
    )
      return;
    setCollectPostLoading(true);
    try {
      let nonce = client.getLatestBlockhash();

      const authSig = await checkAndSignAuthMessage({
        chain: "polygon",
        nonce: nonce!,
      });

      await client.connect();

      const encryptedItems = await encryptItems(
        client,
        {
          ...fulfillmentDetails,
          contact: lensConnected?.handle?.suggestedFormatted?.localName!,
        },
        address,
        authSig,
        cartItems
      );

      encryptedItems && setEncrypted(encryptedItems);
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectPostLoading(false);
  };

  const collectItem = async () => {
    if (!encrypted) return;

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
          cartItems
            ?.filter(
              (item) =>
                item?.item?.collectionMetadata?.title ==
                chooseCartItem?.item?.collectionMetadata?.title
            )
            ?.reduce(
              (accumulator, currentItem) =>
                accumulator +
                Number(currentItem?.item?.prices?.[currentItem.chosenIndex!]) *
                  currentItem.chosenAmount,
              0
            ) *
            10 ** 18
        ) /
          Number(
            oracleData?.find(
              (oracle) =>
                oracle.currency?.toLowerCase() ===
                checkoutCurrency?.toLowerCase()
            )?.rate
          )) *
          Number(
            oracleData?.find(
              (oracle) =>
                oracle.currency?.toLowerCase() ===
                checkoutCurrency?.toLowerCase()
            )?.wei
          )
      ) {
        dispatch(
          setInsufficientBalance({
            actionValue: true,
            actionMessage: "Pockets Empty. Need to top up?",
          })
        );
        setCollectPostLoading(false);
        return;
      }

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const unknownOpenAction = encodeActData(
        chooseCartItem!,
        cartItems,
        encrypted?.find((item) => item?.pubId == chooseCartItem?.item?.pubId)
          ?.data || "",
        checkoutCurrency as `0x${string}`
      );

      const success = await actPost(
        `${toHexWithLeadingZero(
          Number(chooseCartItem?.item?.profileId)
        )}-${toHexWithLeadingZero(Number(chooseCartItem?.item?.pubId))}`,
        {
          unknownOpenAction,
        },
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );

      if (success) {
        const newItems = [...cartItems];

        const newCart = newItems
          ?.filter((item) => item?.item?.pubId !== chooseCartItem?.item?.pubId)
          ?.filter(Boolean);

        if (newCart?.length < 1) {
          dispatch(setCart([]));
          removeCartItemsLocalStorage();
          setEncrypted(undefined);
          setFulfillmentDetails({
            name: "",
            contact: "",
            address: "",
            zip: "",
            city: "",
            state: "",
            country: "",
          });
          dispatch(
            setModalOpen({
              actionOpen: true,
              actionMessage:
                "They're all yours, now. Keep up with fulfillment & shipping in your account page.",
            })
          );
          router.push(
            `https://cypher.digitalax.xyz/autograph/${
              lensConnected?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )?.[1]
            }`
          );
        }

        dispatch(setCart(newCart));
        setCartItemsLocalStorage(JSON.stringify(newCart));
        setChooseCartItem(newCart?.[0]);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setCollectPostLoading(false);
  };

  const approveSpend = async () => {
    setCollectPostLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const item = cartItems?.find(
        (item) => item?.item?.pubId === chooseCartItem?.item?.pubId
      );

      const { request } = await publicClient.simulateContract({
        address: checkoutCurrency as `0x${string}`,
        abi: [
          checkoutCurrency === "0xf87b6343c172720ac9cc7d1c9465d63454a8ef30"
            ? {
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
                outputs: [
                  { internalType: "bool", name: "success", type: "bool" },
                ],
                stateMutability: "nonpayable",
                type: "function",
              }
            : checkoutCurrency === "0x3cf7283c025d82390e86d2feb96eda32a393036b"
            ? {
                constant: false,
                inputs: [
                  { name: "guy", type: "address" },
                  { name: "wad", type: "uint256" },
                ],
                name: "approve",
                outputs: [{ name: "", type: "bool" }],
                payable: false,
                stateMutability: "nonpayable",
                type: "function",
              }
            : {
                inputs: [
                  {
                    internalType: "address",
                    name: "spender",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                  },
                ],
                name: "approve",
                outputs: [
                  {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                  },
                ],
                stateMutability: "nonpayable",
                type: "function",
              },
        ],
        functionName: "approve",
        chain: polygon,
        args: [
          COIN_OP_OPEN_ACTION,
          ((Number(
            cartItems
              ?.filter(
                (item) =>
                  item?.item?.collectionMetadata?.title ==
                  chooseCartItem?.item?.collectionMetadata?.title
              )
              ?.reduce(
                (accumulator, currentItem) =>
                  accumulator +
                  Number(
                    currentItem?.item?.prices?.[currentItem.chosenIndex!]
                  ) *
                    currentItem.chosenAmount,
                0
              ) *
              10 ** 18
          ) /
            Number(
              oracleData?.find(
                (oracle) =>
                  oracle.currency?.toLowerCase() ===
                  checkoutCurrency?.toLowerCase()
              )?.rate
            )) *
            Number(
              oracleData?.find(
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
            cartItems
              ?.filter(
                (item) =>
                  item?.item?.collectionMetadata?.title ==
                  chooseCartItem?.item?.collectionMetadata?.title
              )
              ?.reduce(
                (accumulator, currentItem) =>
                  accumulator +
                  Number(
                    currentItem?.item?.prices?.[currentItem.chosenIndex!]
                  ) *
                    currentItem.chosenAmount,
                0
              ) *
              10 ** 18
          ) /
            Number(
              oracleData?.find(
                (oracle) =>
                  oracle.currency?.toLowerCase() ===
                  checkoutCurrency?.toLowerCase()
              )?.rate
            )) *
            Number(
              oracleData?.find(
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
    if (lensConnected?.id) {
      checkApproved();
    }
  }, [checkoutCurrency, chooseCartItem, lensConnected?.id]);

  useEffect(() => {
    if (cartItems?.length > 0 && !chooseCartItem) {
      setChooseCartItem(cartItems?.[0]);
    }
  }, [cartItems?.length]);

  useEffect(() => {
    if (
      chooseCartItem &&
      chooseCartItem?.item?.acceptedTokens?.findIndex(
        (item) => item?.toLowerCase() == checkoutCurrency?.toLowerCase()
      ) == -1
    ) {
      setCheckoutCurrency(
        chooseCartItem?.item?.acceptedTokens?.[0]?.toLowerCase()
      );
    }
  }, [chooseCartItem]);

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
    chooseCartItem,
    setChooseCartItem,
    isApprovedSpend,
    startIndex,
    setStartIndex,
    encrypted,
    setEncrypted,
  };
};

export default useCheckout;

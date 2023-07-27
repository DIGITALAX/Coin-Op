import { CartItem } from "@/components/Common/types/common.types";
import { useEffect, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { setMessagesModal } from "../../../../../redux/reducers/messagesModalSlice";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { useAccount } from "wagmi";
import {
  ACCEPTED_TOKENS,
  COIN_OP_MARKET,
  COIN_OP_ORACLE,
} from "../../../../../lib/constants";
import { BigNumber, ethers } from "ethers";
import CoinOpMarketABI from "../../../../../abis/CoinOpMarket.json";
import { RootState } from "../../../../../redux/store";
import { setCart } from "../../../../../redux/reducers/cartSlice";
import { useRouter } from "next/router";
import { setLitClient } from "../../../../../redux/reducers/litClientSlice";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygonMumbai, polygon } from "viem/chains";

const useCheckout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http("https://rpc-mumbai.maticvigil.com/"),
  });

  const stripe = useStripe();
  const elements = useElements();
  const cartItems = useSelector(
    (state: RootState) => state.app.cartReducer.value
  );
  const litClient = useSelector(
    (state: RootState) => state.app.litClientReducer.value
  );
  const [approved, setApproved] = useState<boolean>(false);
  const [cartItem, setCartItem] = useState<CartItem | undefined>();
  const [startIndex, setStartIndex] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<string>("fiat");
  const [oracleValue, setOracleValue] = useState<number>(1);
  const [cryptoCheckoutLoading, setCryptoCheckoutLoading] =
    useState<boolean>(false);
  const [fiatCheckoutLoading, setFiatCheckoutLoading] =
    useState<boolean>(false);
  const [checkoutCurrency, setCheckoutCurrency] = useState<string>("USDT");
  const [totalAmount, setTotalAmount] = useState<number>(
    cartItems?.length > 0
      ? cartItems?.reduce(
          (accumulator, currentItem) =>
            accumulator + (currentItem.price * currentItem.amount) / 10 ** 18,
          0
        )
      : 0
  );
  const [fulfillmentDetails, setFulfillmentDetails] = useState<{
    name: string;
    contact: string;
    address: string;
    zip: string;
    city: string;
    state: string;
  }>({
    name: "",
    contact: "",
    address: "",
    zip: "",
    city: "",
    state: "",
  });

  const getAddressApproved = async () => {
    try {
      const data = await publicClient.readContract({
        address: ACCEPTED_TOKENS.find(
          ([_, token]) => token === checkoutCurrency
        )?.[2] as `0x${string}`,
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
        args: [address as `0x${string}`, COIN_OP_MARKET],
      });

      if (
        Number(data as BigNumber) /
          ((ACCEPTED_TOKENS.find(
            ([_, token]) => token === checkoutCurrency
          )?.[2] as `0x${string}`) ===
          "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
            ? 10 ** 6
            : 10 ** 18) >=
        totalAmount
      ) {
        setApproved(true);
      } else {
        setApproved(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getTotalAmount = async () => {
    if (cartItems.length < 1) {
      setTotalAmount(0);
    } else {
      const total = cartItems?.reduce(
        (accumulator, currentItem) =>
          accumulator + (currentItem.price * currentItem.amount) / 10 ** 18,
        0
      );

      const data = await publicClient.readContract({
        address: COIN_OP_ORACLE,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_tokenAddress",
                type: "address",
              },
            ],
            name: "getRateByAddress",
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
        functionName: "getRateByAddress",
        args: [
          ACCEPTED_TOKENS.find(([_, token]) => token === checkoutCurrency)?.[2],
        ],
      });

      if (data) {
        const oracle = Number(data as BigNumber) / 10 ** 18;
        setOracleValue(oracle);
        setTotalAmount(Number(total) / Number(oracle));
      }
    }
  };

  const handleCheckoutFiat = async () => {
    setFiatCheckoutLoading(true);
    try {
      if (!stripe || !elements) {
        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `/success"`,
        },
      });

      if (error.type === "card_error" || error.type === "validation_error") {
        dispatch(
          setMessagesModal({
            actionOpen: true,
            actionMessage: error.message,
          })
        );
      } else {
        dispatch(
          setMessagesModal({
            actionOpen: true,
            actionMessage: "An unexpected error occurred.",
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setFiatCheckoutLoading(false);
  };

  const handleApproveSpend = async () => {
    setCryptoCheckoutLoading(true);
    try {
      const { request } = await publicClient.simulateContract({
        address: ACCEPTED_TOKENS.find(
          ([_, token]) => token === checkoutCurrency
        )?.[2]! as `0x${string}`,
        abi: (checkoutCurrency === "MONA"
          ? [
              {
                inputs: [
                  { internalType: "address", name: "spender", type: "address" },
                  { internalType: "uint256", name: "tokens", type: "uint256" },
                ],
                name: "approve",
                outputs: [
                  { internalType: "bool", name: "success", type: "bool" },
                ],
                stateMutability: "nonpayable",
                type: "function",
              },
            ]
          : checkoutCurrency === "WMATIC"
          ? [
              {
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
              },
            ]
          : [
              {
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
            ]) as any,
        functionName: "approve",
        args: [
          COIN_OP_MARKET,
          ethers.utils.parseEther(totalAmount.toString() || "0"),
        ],
        account: address,
      });
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      if (res) {
        setApproved(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCryptoCheckoutLoading(false);
  };

  const handleCheckoutCrypto = async () => {
    setCryptoCheckoutLoading(true);
    try {
      let client: LitJsSdk.LitNodeClient | undefined;
      if (!litClient) {
        client = await connectLit();
      }
      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: "polygon",
      });
      const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
        JSON.stringify(fulfillmentDetails)
      );

      let fulfillerGroups: { [key: string]: CartItem[] } = {};
      for (let i = 0; i < cartItems.length; i++) {
        if (fulfillerGroups[cartItems[i].fulfillerAddress]) {
          fulfillerGroups[cartItems[i].fulfillerAddress].push(cartItems[i]);
        } else {
          fulfillerGroups[cartItems[i].fulfillerAddress] = [cartItems[i]];
        }
      }

      let fulfillerDetails = [];

      for (let fulfillerAddress in fulfillerGroups) {
        let fulfillerEditions = fulfillerGroups[fulfillerAddress].map(
          (item) => {
            return {
              contractAddress: "",
              standardContractType: "",
              chain: "polygon",
              method: "",
              parameters: [":userAddress"],
              returnValueTest: {
                comparator: "=",
                value: item.fulfillerAddress,
              },
            };
          }
        );

        const encryptedSymmetricKey = await (client
          ? client
          : litClient
        ).saveEncryptionKey({
          accessControlConditions: [
            ...fulfillerEditions,
            {
              contractAddress: "",
              standardContractType: "",
              chain: "polygon",
              method: "",
              parameters: [":userAddress"],
              returnValueTest: {
                comparator: "=",
                value: address as string,
              },
            },
          ],
          symmetricKey,
          authSig,
          chain: "polygon",
        });

        const buffer = await encryptedString.arrayBuffer();
        fulfillerDetails.push(
          JSON.stringify({
            fulfillerAddress,
            encryptedString: JSON.stringify(Array.from(new Uint8Array(buffer))),
            encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
              encryptedSymmetricKey,
              "base16"
            ),
          })
        );
      }

      const { request } = await publicClient.simulateContract({
        address: COIN_OP_MARKET,
        abi: CoinOpMarketABI,
        functionName: "buyTokens",
        args: [
          {
            preRollIds: cartItems?.reduce((accumulator: number[], item) => {
              accumulator.push(item.collectionId);
              return accumulator;
            }, []),
            preRollAmounts: cartItems?.reduce((accumulator: number[], item) => {
              accumulator.push(item.amount);
              return accumulator;
            }, []),
            customIds: [],
            customAmounts: [],
            customURIs: [],
            fulfillmentDetails: JSON.stringify(fulfillerDetails),
            chosenTokenAddress: ACCEPTED_TOKENS.find(
              ([_, token]) => token === checkoutCurrency
            )?.[2],
          },
        ],
        account: address,
      });
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });

      dispatch(setCart([]));
      setFulfillmentDetails({
        name: "",
        contact: "",
        address: "",
        zip: "",
        city: "",
        state: "",
      });
      router.push("/success");
    } catch (err: any) {
      console.error(err.message);
    }
    setCryptoCheckoutLoading(false);
  };

  const connectLit = async (): Promise<LitJsSdk.LitNodeClient | undefined> => {
    try {
      const client = new LitJsSdk.LitNodeClient({
        debug: true,
        alertWhenUnauthorized: true,
        chain: 137,
        provider: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
      });
      await client.connect();
      dispatch(setLitClient(client));
      return client;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setFiatCheckoutLoading(false);
          dispatch(
            setMessagesModal({
              actionOpen: true,
              actionMessage: "Payment succeeded!",
            })
          );
          dispatch(setCart([]));
          setFulfillmentDetails({
            name: "",
            contact: "",
            address: "",
            zip: "",
            city: "",
            state: "",
          });
          router.push("/success");
          break;
        case "processing":
          setFiatCheckoutLoading(true);
          dispatch(
            setMessagesModal({
              actionOpen: true,
              actionMessage: "Your payment is processing.",
            })
          );
          break;
        case "requires_payment_method":
          setFiatCheckoutLoading(false);
          dispatch(
            setMessagesModal({
              actionOpen: true,
              actionMessage:
                "Your payment was not successful, please try again.",
            })
          );
          break;
        default:
          setFiatCheckoutLoading(false);
          dispatch(
            setMessagesModal({
              actionOpen: true,
              actionMessage: "Something went wrong.",
            })
          );
          break;
      }
    });
  }, [stripe]);

  useEffect(() => {
    if (paymentType !== "fiat") {
      getTotalAmount();
    }
  }, [
    checkoutCurrency,
    paymentType,
    cartItems?.length,
    cartItems?.reduce(
      (accumulator, currentItem) =>
        accumulator + (currentItem.price * currentItem.amount) / 10 ** 18,
      0
    ),
  ]);

  useEffect(() => {
    getAddressApproved();
  }, [
    address,
    totalAmount,
    checkoutCurrency,
    cartItems?.reduce(
      (accumulator, currentItem) =>
        accumulator + (currentItem.price * currentItem.amount) / 10 ** 18,
      0
    ),
  ]);

  return {
    cartItem,
    setCartItem,
    startIndex,
    setStartIndex,
    paymentType,
    setPaymentType,
    handleCheckoutFiat,
    handleCheckoutCrypto,
    cryptoCheckoutLoading,
    fiatCheckoutLoading,
    checkoutCurrency,
    setCheckoutCurrency,
    handleApproveSpend,
    fulfillmentDetails,
    setFulfillmentDetails,
    approved,
    oracleValue,
  };
};

export default useCheckout;
